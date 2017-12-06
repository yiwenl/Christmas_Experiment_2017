// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
// import ViewObjModel from './ViewObjModel';
import ViewSphereOpening from './ViewSphereOpening';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.camera.setPerspective(Math.PI/4, GL.aspectRatio, .1,100);
		this.orbitalControl.radius.value = 0.1;
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();

		this._vOpening = new ViewSphereOpening();
	}


	render() {
		GL.clear(0, 0, 0, 0);


		this._vOpening.render();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		GL.setSize(innerWidth, innerHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;