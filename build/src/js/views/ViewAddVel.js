// ViewAddVel.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/addvel.frag';

class ViewAddVel extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
	}


	render(texturePos, textureVel) {
		this.shader.bind();

		this.shader.uniform('texturePos', 'uniform1i', 0);
		texturePos.bind(0);

		this.shader.uniform('textureVel', 'uniform1i', 1);
		textureVel.bind(1);

		GL.draw(this.mesh);
	}


}

export default ViewAddVel;