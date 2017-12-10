// ViewRender.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';
import fsShadow from 'shaders/renderShadow.frag';

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.shaderShadow = new alfrid.GLShader(vs, fsShadow);
		this.time = Math.random() * 0xFFF;

		this.mtxModel = mat4.create();
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(0, 0, -14));
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


	render(textureCurr, textureNext, p, textureExtra, textureMap, mtxView, mtxProj, mtxShadow, shadowMap) {
		const shader = mtxShadow ? this.shaderShadow : this.shader;
		this.time += 0.1;
		shader.bind();

		shader.uniform('textureCurr', 'uniform1i', 0);
		textureCurr.bind(0);

		shader.uniform('textureNext', 'uniform1i', 1);
		textureNext.bind(1);

		shader.uniform('textureExtra', 'uniform1i', 2);
		textureExtra.bind(2);

		shader.uniform("textureMap", "uniform1i", 3);
		textureMap.bind(3);

		shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		shader.uniform('percent', 'float', p);
		shader.uniform('time', 'float', this.time);

		shader.uniform("uLeftView", "mat4", mtxView);
		shader.uniform("uLeftProj", "mat4", mtxProj);

		if(mtxShadow) {
			shader.uniform("uShadowMatrix", "mat4", mtxShadow);
			shader.uniform("textureShadow", "uniform1i", 4);
			shadowMap.bind(4);
		} else {
			shader.uniform("uShadowMatrix", "mat4", mtxView);
		}

		GL.pushMatrix();
		GL.rotate(this.mtxModel);
		GL.draw(this.mesh);
		GL.popMatrix();
	}


}

export default ViewRender;