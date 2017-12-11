// ViewFace.js

import alfrid, { GL } from 'alfrid';
import Assets from '../Assets';
import vs from 'shaders/face.vert';
import fs from 'shaders/face.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewFace extends alfrid.View {
	
	constructor() {
		super(vs, alfrid.ShaderLibs.copyFrag);
	}


	_init() {
		this._functions = [
			'Math.sin(t)'
		];
		this._faces = [];
		const numFaces = 15;
		let a = Math.PI/2;
		for(let i=0; i<numFaces; i++) {
			let t = random(1, 2);
			let speed = random(.04, .02);
			let m = mat4.create();
			let r = random(-4, -6);
			let id = Math.floor(Math.random() * 8) + 1;
			let funcId = Math.floor(Math.random() * this._functions.length);
			let s = random(.5, 2);

			console.log(funcId);
			let texture = Assets.get(`face${id}`);

			mat4.rotateY(m, m, Math.PI + random(-a, a));
			mat4.rotateX(m, m, random(.1, 1));
			mat4.translate(m, m, vec3.fromValues(0, 0, r));
			const func = new Function( 't', 'return ' + this._functions[funcId]);

			const face = {
				t,
				s,
				speed,
				m, 
				texture,
				func
			}

			this._faces.push(face);
		}


		const s = 1
		this.mesh = alfrid.Geom.plane(s, s, 1);
	}


	render(textureMap) {
		this.t += 0.01;
		const { sin, cos, abs, pow, PI } = Math;

		this.shader.bind();
		this.shader.uniform("textureMap", "uniform1i", 0);
		textureMap.bind(0);

		GL.disable(GL.DEPTH_TEST);
		GL.enableAdditiveBlending();
		this._faces.forEach(face => {
			face.t += face.speed;
			GL.rotate(face.m);
			let scale = 1 + face.func(face.t) * 0.25 * face.s;
			this.shader.uniform("uScale", "float", scale);
			this.shader.uniform("texture", "uniform1i", 1);
			face.texture.bind(1);

			GL.draw(this.mesh);	
		});
		GL.enableAlphaBlending();
		GL.enable(GL.DEPTH_TEST);
	}


}

export default ViewFace;