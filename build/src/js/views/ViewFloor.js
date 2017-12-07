// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.mtxModel = mat4.create();
		mat4.translate(this.mtxModel, this.mtxModel, vec3.fromValues(0, -0.75, -1));
	}


	_init() {
		const s = 5;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render(shadowMatrix, shadowMap) {
		this.shader.bind();
		GL.pushMatrix();

		GL.rotate(this.mtxModel);

		this.shader.uniform("uShadowMatrix", "mat4", shadowMatrix);
		this.shader.uniform("texureShadow", "uniform1i", 0);
		shadowMap.bind(0);

		GL.draw(this.mesh);

		GL.popMatrix();
	}


}

export default ViewFloor;