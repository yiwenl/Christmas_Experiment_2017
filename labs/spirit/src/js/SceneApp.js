// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewSphere from './ViewSphere';
import ViewSpirit from './ViewSpirit';
import ViewSave from './ViewSave';
import ViewSim from './ViewSim';
import ViewRender from './ViewRender';

import Assets from './Assets';

const RAD = Math.PI / 180;

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.radius.value = 5;

		this.orbitalControl.lock(true);


		this.cameraSphere = new alfrid.CameraPerspective();
		const FOV = 90 * RAD;
		this.cameraSphere.setPerspective(FOV, GL.aspectRatio, .1, 100);
		this.orbControlSphere = new alfrid.OrbitalControl(this.cameraSphere, window, .01);
		const easing = 0.1;
		this.orbControlSphere.rx.easing = easing;
		this.orbControlSphere.ry.easing = easing;
		// this.orbControlSphere.rx.value = -.85;
		this.orbControlSphere.ry.value = .3;

		this.modelMatrix = mat4.create();
	}

	_initTextures() {
		this._fboMap = new alfrid.FrameBuffer(1024, 1024, {minFilter:GL.LINEAR});

		const numParticles = params.numParticles;
		const o = {
			minFilter:GL.NEAREST,
			magFilter:GL.NEAREST,
			type:GL.FLOAT
		};

		this._fboCurrent  	= new alfrid.FrameBuffer(numParticles, numParticles, o, 4);
		this._fboTarget  	= new alfrid.FrameBuffer(numParticles, numParticles, o, 4);
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();

		this._vSphere = new ViewSphere();
		this._vSpirit = new ViewSpirit();
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


	_updateMap() {
		this._fboMap.bind();
		GL.clear(0, 0, 0, 0);
		GL.rotate(this.cameraSphere.matrix);
		this._vSphere.render();
		this._fboMap.unbind();
	}


	_updateParticles() {
		this._fboTarget.bind();
		GL.clear(0, 0, 0, 1);
		// this._vSim.render(this._fboCurrent.getTexture(1), this._fboCurrent.getTexture(0), this._fboCurrent.getTexture(2));
		this._vSim.render(this._fboCurrent, this._fboMap.getTexture());
		this._fboTarget.unbind();


		let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;
	}


	render() {
		this._updateMap();
		this._updateParticles();

		GL.clear(0, 0, 0, 0);
		
		GL.disable(GL.DEPTH_TEST);
		this._bCopy.draw(this._fboMap.getTexture());
		GL.rotate(this.modelMatrix);
		this._vSpirit.render(this._fboMap.getTexture());


		GL.enable(GL.DEPTH_TEST);
		this._vRender.render(this._fboTarget.getTexture(0), this._fboTarget.getTexture(2), this._fboTarget.getTexture(3));

		const s = 200;
		// GL.viewport(0, 0, s, s);
		for(let i=0; i<this._fboTarget.numTargets; i++) {
			GL.viewport(i * s, 0, s, s);
			// this._bCopy.draw(this._fboTarget.getTexture(i));
		}
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;