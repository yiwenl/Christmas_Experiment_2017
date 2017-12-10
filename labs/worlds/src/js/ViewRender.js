// ViewRender.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';
import fsShadow from 'shaders/renderShadow.frag';

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderShadow = new alfrid.GLShader(vs, fsShadow);
		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, 0, -4));
		this.time = Math.random() * 0xFFF;
	}


	_init() {
		let positions    = [];
		let coords       = [];
		let indices      = []; 
		let count        = 0;
		let numParticles = params.numParticles;
		let ux, uy;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				ux = i / numParticles;
				uy = j / numParticles;
				positions.push([ux, uy, 0]);
				indices.push(count);
				count ++;

			}
		}

		this.mesh = new alfrid.Mesh(GL.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex(indices);
	}

	renderShadow(textureCurr, textureNext, p, textureExtra, textureDebug) {

		const shader = this.shaderShadow;

		this.time += 0.1;
		shader.bind();

		shader.uniform('textureCurr', 'uniform1i', 0);
		textureCurr.bind(0);

		shader.uniform('textureNext', 'uniform1i', 1);
		textureNext.bind(1);

		shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		shader.uniform("textureDebug", "uniform1i", 3);
		textureDebug.bind(3);

		shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		shader.uniform('percent', 'float', p);
		shader.uniform('time', 'float', this.time);

		GL.pushMatrix();
		GL.rotate(this.mtx);
		GL.draw(this.mesh);
		GL.popMatrix();
	}


	render(textureCurr, textureNext, p, textureExtra, textureDebug, shadowMatrix, shadowMap) {
		this.time += 0.1;
		this.shader.bind();

		this.shader.uniform('textureCurr', 'uniform1i', 0);
		textureCurr.bind(0);

		this.shader.uniform('textureNext', 'uniform1i', 1);
		textureNext.bind(1);

		this.shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		this.shader.uniform("textureDebug", "uniform1i", 3);
		textureDebug.bind(3);

		this.shader.uniform("uShadowMap", "uniform1i", 4);
		shadowMap.bind(4);

		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		this.shader.uniform('percent', 'float', p);
		this.shader.uniform('time', 'float', this.time);
		this.shader.uniform("uShadowMatrix", "mat4", shadowMatrix);

		GL.pushMatrix();
		GL.rotate(this.mtx);
		GL.draw(this.mesh);
		GL.popMatrix();
	}


}

export default ViewRender;