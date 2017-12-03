// ViewRender.js

import alfrid, { GL } from 'alfrid';

import vs from 'shaders/render.vert';
import fs from 'shaders/render.frag';

class ViewRender extends alfrid.View {
	
	constructor() {
		super(vs, fs);
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

	render(texturePos, textureExtra, textureMap) {
		this.shader.bind();
		this.shader.uniform("texturePos", "uniform1i", 0);
		texturePos.bind(0);
		this.shader.uniform("textureExtra", "uniform1i", 1);
		textureExtra.bind(1);
		this.shader.uniform("textureMap", "uniform1i", 2);
		textureMap.bind(2);
		this.shader.uniform('uViewport', 'vec2', [GL.width, GL.height]);
		GL.draw(this.mesh);
	}


}

export default ViewRender;