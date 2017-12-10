// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import VRUtils from './utils/VRUtils';
import SubsceneParticles from './SubsceneParticles';
import SubsceneChars from './SubsceneChars';
import ViewSphere from './views/ViewSphere';
import ViewFloor from './views/ViewFloor';
import ViewLine from './views/ViewLine';
import ViewPointer from './views/ViewPointer';

const scissor = function(x, y, w, h) {
	GL.scissor(x, y, w, h);
	GL.viewport(x, y, w, h);
}

class SceneApp extends Scene {
	constructor() {
		super();
		
		//	ORBITAL CONTROL
		this.orbitalControl.radius.value = .1;
		this.orbitalControl.lock(true);
		this.camera.setPerspective(Math.PI * 0.25, GL.aspectRatio, .1, 100);


		this._initSubScene();

		//	VR CAMERA
		this.cameraVR = new alfrid.Camera();

		//	MODEL MATRIX
		this._modelMatrix = mat4.create();

		


		//	LIGHT
		this._cameraLight = new alfrid.CameraOrtho();
		const s = .75;
		this._cameraLight.ortho(-s, s, -s, s, .1, 15);
		// this._cameraLight.lookAt([0, 10, 0], [0, 0, 0], [0, 0, -1]);
		this._cameraLight.lookAt([0, 5, 1.5], [0, 0, -2]);
		this._shadowMatrix = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);


		this._mtxLeftView = mat4.create();
		this._mtxLeftProj = mat4.create();

		if(VRUtils.canPresent) {
			// mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, 0, -3));
			GL.enable(GL.SCISSOR_TEST);
			this.toRender();

			this.resize();
		}

	}


	_initSubScene() {
		this._sceneParticles = new SubsceneParticles(this);
		this._sceneChars = new SubsceneChars(this);
	}

	_initTextures() {
		this._fboMap = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
		this._fboShadow 	= new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vSphere = new ViewSphere();
		this._vFloor = new ViewFloor();
		this._vPointer = new ViewPointer();

		//	load drawings
		this._lines = [];

	}


	_updateMap() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 0);
		this._vSphere.render(this._mtxLeftProj);
		this._fboMap.unbind();
	}

	_updateShadowMap() {
		this._fboShadow.bind();
		GL.clear(0, 0, 0, 0);
		GL.setMatrices(this._cameraLight);
		this._sceneParticles.render(this.textureMap, this._mtxLeftView, this._mtxLeftProj);
		this._fboShadow.unbind();
	}


	render() {
		this._updateMap();
		this._sceneParticles.update(this.textureMap);
		this._updateShadowMap();

		if(!VRUtils.canPresent) { this.toRender(); }
	}


	toRender() {
		if(VRUtils.canPresent) {	VRUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());	}		

		VRUtils.getFrameData();

		if(VRUtils.isPresenting && !GL.isMobile) {
			
			const w2 = GL.width/2;
			VRUtils.setCamera(this.cameraVR, 'left');

			mat4.copy(this._mtxLeftView, this.cameraVR.matrix);
			mat4.copy(this._mtxLeftProj, this.cameraVR.projection);

			scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();


			VRUtils.setCamera(this.cameraVR, 'right');
			scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();

			VRUtils.submitFrame();

			//	re-render whole
			scissor(0, 0, GL.width, GL.height);

			GL.clear(0, 0, 0, 0);
			mat4.copy(this.cameraVR.projection, this.camera.projection);

			GL.setMatrices(this.cameraVR);
			GL.rotate(this._modelMatrix);
			this.renderScene();

		} else {

			if(VRUtils.canPresent) {
				VRUtils.setCamera(this.cameraVR, 'left');
				mat4.copy(this.cameraVR.projection, this.camera.projection);

				mat4.copy(this._mtxLeftView, this.cameraVR.matrix);
				mat4.copy(this._mtxLeftProj, this.cameraVR.projection);

				scissor(0, 0, GL.width, GL.height);
				GL.setMatrices(this.cameraVR);
				GL.rotate(this._modelMatrix);
				this.renderScene();
			} else {
				mat4.copy(this._mtxLeftView, this.camera.matrix);
				mat4.copy(this._mtxLeftProj, this.camera.projection);

				GL.setMatrices(this.camera);
				GL.rotate(this._modelMatrix);
				this.renderScene();	
			}
			
		}
	}


	renderScene() {
		GL.clear(0, 0, 0, 0);
		GL.disable(GL.DEPTH_TEST);
		this._vSphere.render(this._mtxLeftProj);
		GL.enable(GL.DEPTH_TEST);
		this._vFloor.render(this._shadowMatrix, this.shadowMap);

		this._sceneChars.render(this.textureMap, this._mtxLeftView, this._mtxLeftProj);
		// this._sceneParticles.render(this.textureMap, this._mtxLeftView, this._mtxLeftProj, this._shadowMatrix, this.shadowMap);
		
		
		
		if(!GL.isMobile && VRUtils.hasVR) {
			this._vPointer.render();	
		}

	}


	resize() {
		let scale = VRUtils.canPresent ? 2 : 1;
		if(GL.isMobile) scale = window.devicePixelRatio;

		// const ratio = 1920/1080;
		// const w = Math.max(window.innerWidth * scale, 1920);
		GL.setSize(window.innerWidth * scale, window.innerHeight * scale);
		// GL.setSize(w, w/ratio);
		this.camera.setAspectRatio(GL.aspectRatio);

		console.log('Canvas Size :', GL.width, GL.height);
	}


	get textureMap() {
		return this._fboMap.getTexture();
	}

	get shadowMap() {
		return this._fboShadow.getDepthTexture();
	}
}


export default SceneApp;