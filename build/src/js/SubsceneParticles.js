// SubsceneParticles.js

import alfrid, { GL } from 'alfrid';


import ViewAddVel from './views/ViewAddVel';
import ViewSave from './views/ViewSave';
import ViewRender from './views/ViewRender';
import ViewSim from './views/ViewSim';

class SubsceneParticles {

	constructor(parentScene) {
		this._parent = parentScene;

		this._init();
	}


	_init() {
		const numParticles = params.numParticles;
		const type = window.iOS ? GL.HALF_FLOAT : GL.FLOAT;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type
		};

		this._fboCurrentPos = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboTargetPos  = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboCurrentVel = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboTargetVel  = new alfrid.FrameBuffer(numParticles, numParticles, o);
		this._fboExtra  	= new alfrid.FrameBuffer(numParticles, numParticles, o);


		const { camera, cameraOrtho } = this._parent;

		//	helpers
		this._bCopy = new alfrid.BatchCopy();

		//	views
		this._vAddVel = new ViewAddVel();
		this._vRender = new ViewRender();
		this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave();
		GL.setMatrices(cameraOrtho);

		this._fboCurrentPos.bind();
		this._vSave.render(0);
		this._fboCurrentPos.unbind();

		this._fboExtra.bind();
		this._vSave.render(1);
		this._fboExtra.unbind();

		this._fboTargetPos.bind();
		this._bCopy.draw(this._fboCurrentPos.getTexture());
		this._fboTargetPos.unbind();

		GL.setMatrices(camera);

		
	}


	update(textureMap, mtxView, mtxProj) {
		this._fboTargetVel.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrentVel.getTexture(), 
			this._fboCurrentPos.getTexture(), 
			this._fboExtra.getTexture(),
			textureMap,
			mtxView, 
			mtxProj
			);
		this._fboTargetVel.unbind();


		//	Update position : bind target Position, render addVel with current position / target velocity;
		this._fboTargetPos.bind();
		GL.clear(0, 0, 0, 0);
		this._vAddVel.render(this._fboCurrentPos.getTexture(), this._fboTargetVel.getTexture());
		this._fboTargetPos.unbind();

		//	SWAPPING : PING PONG
		let tmpVel          = this._fboCurrentVel;
		this._fboCurrentVel = this._fboTargetVel;
		this._fboTargetVel  = tmpVel;

		let tmpPos          = this._fboCurrentPos;
		this._fboCurrentPos = this._fboTargetPos;
		this._fboTargetPos  = tmpPos;
		
	}


	render(textureMap, mtxView, mtxProj, shadowMatrix, shadowMap) {
		this._vRender.render(
			this._fboTargetPos.getTexture(), 
			this._fboCurrentPos.getTexture(), 
			0, 
			this._fboExtra.getTexture(),
			textureMap,
			mtxView, 
			mtxProj, 
			shadowMatrix, 
			shadowMap
		);
	}
}


export default SubsceneParticles;