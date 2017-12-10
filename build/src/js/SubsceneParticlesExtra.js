// SubsceneParticlesExtra.js

import alfrid, { GL } from 'alfrid';
import ViewSave from './views/ViewSaveMulti';
import ViewSim from './views/ViewSimMulti';

class SubsceneParticlesExtra {
	
	constructor(parentScene) {
		this._parent = parentScene;

		this._init();
	}

	_init() {
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, 4);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, 4);

		const { camera, cameraOrtho } = this._parent;

		// this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave();
		GL.setMatrices(cameraOrtho);

		this._fboCurrent.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboTarget.unbind();

		GL.setMatrices(camera);
	}


	update(textureMap) {
		// this._fboTarget.bind();
		// GL.clear(0, 0, 0, 1);
		// this._vSim.render(
		// 	this._fboCurrent.getTexture(1),
		// 	this._fboCurrent.getTexture(0),
		// 	this._fboCurrent.getTexture(2),
		// 	textureMap
		// );
		// this._fboTarget.unbind();


		// let tmp          = this._fboCurrent;
		// this._fboCurrent = this._fboTarget;
		// this._fboTarget  = tmp;
	}


	render(textureMap, mtxView, mtxProj, shadowMatrix, shadowMap) {
	}
}


export default SubsceneParticlesExtra;