// SceneApp.js

import alfrid, { Scene, GL } from 'alfrid';
import ViewLines from './ViewLines';
import Assets from './Assets';

class SceneApp extends Scene {
	constructor() {
		super();
		this.resize();
		GL.enableAlphaBlending();
		this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
		this.orbitalControl.radius.value = 5;
	}

	_initTextures() {
		console.log('init textures');
	}


	_initViews() {
		console.log('init views');

		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();

		this._vLines = new ViewLines();
	}


	render() {
		// this.orbitalControl.ry.value += 0.01;
		GL.clear(0, 0, 0, 0);

		// this._bSky.draw(Assets.get('studio_radiance'));
		this._bAxis.draw();
		this._bDots.draw();

		this._vLines.render();
	}


	resize() {
		const { innerWidth, innerHeight, devicePixelRatio } = window;
		let scale = devicePixelRatio;
		if(!GL.isMobile) {
			scale = 1;
		}
		GL.setSize(innerWidth * scale, innerHeight * scale);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;