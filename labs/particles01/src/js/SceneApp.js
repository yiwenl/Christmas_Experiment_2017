// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewRenderShadow from './ViewRenderShadow';
import ViewSim from './ViewSim';
import ViewFloor from './ViewFloor';
import ViewSphere from './ViewSphere';
import ViewChar from './ViewChar';

window.getAsset = function(id) {
	return assets.find( (a) => a.id === id).file;
}

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		GL.enableAlphaBlending();

		this._count = 0;
		this.camera.setPerspective(Math.PI/2, GL.aspectRatio, .1, 200);
		this.orbitalControl.radius.value = 15;
		this.orbitalControl.lock(true);

		this._cameraLight = new alfrid.CameraOrtho();
		const s = 10;
		this._cameraLight.ortho(-s, s, -s, s, 1, 50);
		this._cameraLight.lookAt([0, 10, 2.5], [0, 0, 0], [0, 1, 0]);
		// this._cameraLight.lookAt([0, 10, 0], [0, 0, 0], [0, 0, -1]);

		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);
		this._shadowMatrix = mat4.create();
		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);

		this.modelMatrix = mat4.create();
	}

	_initTextures() {
		console.log('init textures');

		//	FBOS
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, 5);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, 5);

		this._fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
		this._fboMap = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR});
	}


	_initViews() {
		console.log('init views');
		
		//	helpers
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();
		this._vFloor = new ViewFloor();
		this._vSphere = new ViewSphere();
		this._vChar = new ViewChar();


		//	views
		this._vRender = new ViewRender();
		this._vRenderShadow = new ViewRenderShadow();
		this._vSim 	  = new ViewSim();

		this._vSave = new ViewSave();
		GL.setMatrices(this.cameraOrtho);


		this._fboCurrent.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboCurrent.unbind();

		this._fboTarget.bind();
		GL.clear(0, 0, 0, 0);
		this._vSave.render();
		this._fboTarget.unbind();

		GL.setMatrices(this.camera);
	}


	updateFbo() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		this._vSim.render(
			this._fboCurrent.getTexture(1), 
			this._fboCurrent.getTexture(0), 
			this._fboCurrent.getTexture(2),
			this._fboCurrent.getTexture(3),
			this._fboCurrent.getTexture(4),
			this.textureMap
			);
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}

	_renderParticles() {
		let p = this._count / params.skipCount;
		this._vRender.render(
			this._fboTarget.getTexture(0), 
			this._fboCurrent.getTexture(0), 
			p, 
			this._fboTarget.getTexture(2),
			this._shadowMatrix, 
			this._fboShadow.getDepthTexture(),
			this.textureMap,
			this._fboTarget.getTexture(3)
		);
	}

	_renderShadowMap() {
		this._fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		let p = this._count / params.skipCount;
		this._vRenderShadow.render(
			this._fboTarget.getTexture(0), 
			this._fboCurrent.getTexture(0), 
			p, 
			this._fboCurrent.getTexture(2)
		);
		this._fboShadow.unbind();
	}


	render() {
		this._updateMap();

		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		this._renderShadowMap();

		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this.camera);
		// GL.disable(GL.DEPTH_TEST);
		
		this._vSphere.render();
		this._vChar.render();
		// GL.enable(GL.DEPTH_TEST);
		this._vFloor.render(this._shadowMatrix, this._fboShadow.getDepthTexture(), this.textureMap);
		this._renderParticles();

		const s = 300;
		GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._fboMap.getTexture());

		// GL.viewport(s, 0, s, s);
		// this._bCopy.draw(this._fbo)
		// this._bCopy.draw(this._fboShadow.getTexture());
	}

	_updateMap() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 0);
		this._vSphere.render();
		this._fboMap.unbind();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}


	get textureMap() {	return this._fboMap.getTexture();	}
}


export default SceneApp;