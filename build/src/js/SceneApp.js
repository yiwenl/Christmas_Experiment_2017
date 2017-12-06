// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import VRUtils from './utils/VRUtils';
import ViewSphere from './views/ViewSphere';
import ViewFloor from './views/ViewFloor';

const scissor = function(x, y, w, h) {
	GL.scissor(x, y, w, h);
	GL.viewport(x, y, w, h);
}

class SceneApp extends Scene {
	constructor() {
		super();
		
		//	ORBITAL CONTROL
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.1;
		this.orbitalControl.radius.value = .1;
		this.orbitalControl.lock(true);


		//	VR CAMERA
		this.cameraVR = new alfrid.Camera();

		//	MODEL MATRIX
		this._modelMatrix = mat4.create();
		console.log('Has VR :', VRUtils.hasVR);

		if(VRUtils.canPresent) {
			mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, 0, -3));
			GL.enable(GL.SCISSOR_TEST);
			this.toRender();

			this.resize();
		}
	}

	_initTextures() {
		console.log('init textures');

		this._fboMap = new alfrid.FrameBuffer(1024, 1024);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vSphere = new ViewSphere();
		this._vFloor = new ViewFloor();

	}


	_updateMap() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 1);
		this._vSphere.render();
		this._fboMap.unbind();
	}


	render() {
		this._updateMap();

		if(!VRUtils.canPresent) { this.toRender(); }
	}


	toRender() {
		if(VRUtils.canPresent) {	VRUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());	}		

		VRUtils.getFrameData();

		if(VRUtils.isPresenting) {
			
			const w2 = GL.width/2;
			VRUtils.setCamera(this.cameraVR, 'left');
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

				scissor(0, 0, GL.width, GL.height);
				GL.setMatrices(this.cameraVR);
				GL.rotate(this._modelMatrix);
				this.renderScene();
			} else {
				GL.setMatrices(this.camera);
				GL.rotate(this._modelMatrix);
				this.renderScene();	
			}
			
		}
	}


	renderScene() {
		GL.clear(0, 0, 0, 0);

		GL.disable(GL.DEPTH_TEST);
		this._bCopy.draw(this._fboMap.getTexture());
		GL.enable(GL.DEPTH_TEST);

		this._vFloor.render();

	}


	resize() {
		let scale = VRUtils.canPresent ? 2 : 1;
		if(GL.isMobile) scale = window.devicePixelRatio;
		GL.setSize(window.innerWidth * scale, window.innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}

}


export default SceneApp;