// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import Assets from './Assets';
import VRUtils from './utils/VRUtils';
import saveJson from './utils/saveJson';
import ViewLines from './ViewLines';
import ViewPointer from './ViewPointer';
import ViewTrace from './ViewTrace';

import pointsData from './data/points1.json';

const scissor = function(x, y, w, h) {
	GL.scissor(x, y, w, h);
	GL.viewport(x, y, w, h);
}

class SceneApp extends Scene {
	constructor() {
		super();

		console.log(pointsData);
		
		//	ORBITAL CONTROL
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.1;
		this.orbitalControl.radius.value = 5;
		this.camera.setPerspective(Math.PI * .3, GL.aspectRatio, .1, 100000);


		//	VR CAMERA
		this.cameraVR = new alfrid.Camera();

		//	MODEL MATRIX
		this._modelMatrix = mat4.create();
		console.log('Has VR :', VRUtils.hasVR);

		this._rightHand;

		if(VRUtils.canPresent) {
			mat4.translate(this._modelMatrix, this._modelMatrix, vec3.fromValues(0, 0, 0));
			GL.enable(GL.SCISSOR_TEST);
			this.toRender();

			this.resize();
		}
	}

	_initTextures() {
	}


	_initViews() {
		this._vPointer = new ViewPointer();
		this._vTrace = new ViewTrace();
		this._lines =[];
		this._bAxis = new alfrid.BatchAxis();

		this._createNewLine();
		this.load();
	}


	_createNewLine() {
		const vLine = new ViewLines();
		vLine.addEventListener('overflowed', ()=>this._createNewLine());
		this._lines.push(vLine);
	}

	clear() {
		this._lines = [];
		this._createNewLine();
	}


	load() {
		console.log('Loading lines');
		console.log(pointsData.length);
		pointsData.forEach( (lineData, i) => {
			if(!this._lines[i]) {
				this._createNewLine();
			}

			const line = this._lines[i];
			console.log('Load line:', i);
			line.load(lineData);
		});
	}


	save() {
		const pointsData = this._lines.map( line => line.points );
		saveJson(pointsData, 'points.json');
	}


	render() {
		if(!VRUtils.canPresent) { this.toRender(); }
	}


	toRender() {
		if(VRUtils.canPresent) {	VRUtils.vrDisplay.requestAnimationFrame(()=>this.toRender());	}		

		if(!this._rightHand) {
			if(VRUtils.rightHand) {
				this._rightHand = VRUtils.rightHand;
				this._rightHand.addEventListener('mainButtonPressed', ()=>this.clear());
				this._rightHand.addEventListener('button3Released', ()=>this.save());
			}
		}

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

		this._bAxis.draw();

		this._lines.forEach( line => line.render() );
		this._vPointer.render();
		this._vTrace.render();
	}


	resize() {
		let scale = VRUtils.canPresent ? 2 : 1;
		if(GL.isMobile) scale = window.devicePixelRatio;
		GL.setSize(window.innerWidth * scale, window.innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}

}


export default SceneApp;