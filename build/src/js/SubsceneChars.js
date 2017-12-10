// SubsceneChars.js

import alfrid, { GL } from 'alfrid';
import ViewChar from './views/ViewChar';
// import ViewSmallChar from './views/ViewSmallChar';
import ViewSpirit from './views/ViewSpirit';

class SubsceneChars {
	constructor(parentScene) {
		this._parent = parentScene;

		this._init();
	}

	_init() {
		const chars = [
			'char01',
			'char02',
			'char03'
		];

		const m1 = mat4.create();
		let s = 1.2;
		mat4.rotateY(m1, m1, .43 + Math.PI);
		mat4.rotateX(m1, m1, .07);
		mat4.rotateZ(m1, m1, .1);
		mat4.translate(m1, m1, vec3.fromValues(0, 0, -5));
		mat4.scale(m1, m1, vec3.fromValues(s, s, s));

		const m2 = mat4.create();
		s = 1.3;
		mat4.rotateY(m2, m2, + Math.PI);
		mat4.rotateX(m2, m2, .15);
		mat4.rotateZ(m2, m2, 0);
		mat4.translate(m2, m2, vec3.fromValues(0, 0, -6));
		mat4.scale(m2, m2, vec3.fromValues(s, s, s));
		mat4.rotateY(m2, m2, -0.4);
		

		const m3 = mat4.create();
		s = 2.;
		mat4.rotateY(m3, m3, -.5 + Math.PI);
		mat4.rotateX(m3, m3, .1);
		mat4.rotateZ(m3, m3, 0);
		mat4.translate(m3, m3, vec3.fromValues(0, 0, -3.5));
		mat4.scale(m3, m3, vec3.fromValues(s, s, s));
		

		const matrices = [
			m1, m2, m3
		];

		this._vChar = new ViewChar(chars, matrices);
		this._vSpirit = new ViewSpirit();
	}

	render(textureMap, mtxLeftView, mtxLeftProj) {
		this._vChar.render();
		// this._vSmallChar.render();
		this._vSpirit.render(textureMap, mtxLeftView, mtxLeftProj);
	}
}


export default SubsceneChars;