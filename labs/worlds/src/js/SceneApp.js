// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import VRUtils from './utils/VRUtils';

import ViewSphere from './ViewSphere';
import ViewSave from './ViewSave';
import ViewRender from './ViewRender';
import ViewSim from './ViewSim';
import ViewPointer from './ViewPointer';

const scissor = function(x, y, w, h) {
	GL.scissor(x, y, w, h);
	GL.viewport(x, y, w, h);
}

class SceneApp extends Scene {
	constructor() {
		super();
		
		//	ORBITAL CONTROL
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.1;
		this.orbitalControl.radius.value = 5;


		this._count = 0;


		//	VR CAMERA
		this.cameraVRLeft = new alfrid.Camera();
		this.cameraVRRight = new alfrid.Camera();

		//	MODEL MATRIX
		this._modelMatrix = mat4.create();
		console.log('Has VR :', VRUtils.hasVR);


		//	LIGHT
		this._cameraLight = new alfrid.CameraOrtho();
		const s = 10;
		this._cameraLight.ortho(-s, s, -s, s, .1, 50);
		let z = -14;
		this._cameraLight.lookAt([0, 10, z], [0, 0, z], [0, 0, -1]);
		// this._cameraLight.lookAt([0, 5, 1.5], [0, 0, 0]);
		this._shadowMatrix = mat4.create();
		this._biasMatrix = mat4.fromValues(
			0.5, 0.0, 0.0, 0.0,
			0.0, 0.5, 0.0, 0.0,
			0.0, 0.0, 0.5, 0.0,
			0.5, 0.5, 0.5, 1.0
		);

		mat4.multiply(this._shadowMatrix, this._cameraLight.projection, this._cameraLight.viewMatrix);
		mat4.multiply(this._shadowMatrix, this._biasMatrix, this._shadowMatrix);

		if(VRUtils.canPresent) {
			mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, 0, -3));
			GL.enable(GL.SCISSOR_TEST);
			this.toRender();

			this.resize();
		}
	}

	_initTextures() {
		// console.log('init textures');

		console.log(GL.width, window.innerWidth);

		this._fboMap = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, true);

		this._fboShadow = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._vSphere = new ViewSphere();
		this._vPointer = new ViewPointer();


		//	views
		this._vRender = new ViewRender();
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
		VRUtils.setCamera(this.cameraVRLeft, 'left');
		GL.setMatrices(this.cameraVRLeft);
		GL.rotate(this._modelMatrix);
		this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2), this._fboMap.getTexture());
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

	}

	updateShadowMap() {
		let p = this._count / params.skipCount;

		this._fboShadow.bind();
		GL.clear(1, 0, 0, 1);
		GL.setMatrices(this._cameraLight);
		this._vRender.renderShadow(this._fboTarget.getTexture(0), this._fboCurrent.getTexture(0), p, this._fboCurrent.getTexture(2), this._fboTarget.getTexture(3));
		this._fboShadow.unbind();
	}

	_updateMap() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 1);
		this._vSphere.render();
		this._fboMap.unbind();
	}


	render() {
		this._updateMap();

		this._count ++;
		if(this._count % params.skipCount == 0) {
			this._count = 0;
			this.updateFbo();
		}

		this.updateShadowMap();

		if(!VRUtils.canPresent) { this.toRender(); }
	}


	toRender() {
		if(VRUtils.canPresent) {	VRUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());	}		

		VRUtils.getFrameData();

		if(VRUtils.isPresenting) {
			
			const w2 = GL.width/2;
			VRUtils.setCamera(this.cameraVRLeft, 'left');
			scissor(0, 0, w2, GL.height);
			GL.setMatrices(this.cameraVRLeft);
			GL.rotate(this._modelMatrix);
			this.renderScene();


			VRUtils.setCamera(this.cameraVRRight, 'right');
			scissor(w2, 0, w2, GL.height);
			GL.setMatrices(this.cameraVRRight);
			GL.rotate(this._modelMatrix);
			this.renderScene();

			VRUtils.submitFrame();

			//	re-render whole
			scissor(0, 0, GL.width, GL.height);

			GL.clear(0, 0, 0, 0);
			mat4.copy(this.cameraVRLeft.projection, this.camera.projection);

			GL.setMatrices(this.cameraVRLeft);
			GL.rotate(this._modelMatrix);
			this.renderScene();



		} else {

			if(VRUtils.canPresent) {
				VRUtils.setCamera(this.cameraVRLeft, 'left');
				mat4.copy(this.cameraVRLeft.projection, this.camera.projection);

				scissor(0, 0, GL.width, GL.height);
				GL.setMatrices(this.cameraVRLeft);
				GL.rotate(this._modelMatrix);
				this.renderScene();
			} else {
				GL.setMatrices(this.camera);
				GL.rotate(this._modelMatrix);
				this.renderScene();	
			}
			
		}

		let s = 500;
		GL.viewport(0, 0, s, s);
		GL.disable(GL.DEPTH_TEST);
		GL.enable(GL.DEPTH_TEST);
	}


	renderScene() {
		GL.clear(0, 0, 0, 0);

		this._vSphere.render();

		let p = this._count / params.skipCount;
		this._vRender.render(
			this._fboTarget.getTexture(0), 
			this._fboCurrent.getTexture(0), 
			p, 
			this._fboCurrent.getTexture(2), 
			this._fboTarget.getTexture(3),
			this._shadowMatrix,
			this._fboShadow.getDepthTexture()

			);
		this._vPointer.render();
	}


	resize() {
		let scale = VRUtils.canPresent ? 2 : 1;
		if(GL.isMobile) scale = window.devicePixelRatio;
		
		GL.setSize(window.innerWidth * scale, window.innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);

		// this._fboMap = new alfrid.FrameBuffer(GL.width, GL.height, {minFilter:GL.LINEAR, magFilter:GL.LINEAR});
	}

}


export default SceneApp;