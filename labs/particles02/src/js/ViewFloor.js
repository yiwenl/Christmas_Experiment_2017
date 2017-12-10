// ViewFloor.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/floor.vert';
import fs from 'shaders/floor.frag';

class ViewFloor extends alfrid.View {
	
	constructor() {
		super(vs, fs);
		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, -5, 0));
	}


	_init() {
		const s = 30;
		this.mesh = alfrid.Geom.plane(s, s, 1, 'xz');
	}


	render(mShadowMatrix, mTextureDepth, textureMap) {
		this.shader.bind();

		this.shader.uniform("uShadowMatrix", "mat4", mShadowMatrix);
		this.shader.uniform("textureDepth", "uniform1i", 0);
		mTextureDepth.bind(0);
		this.shader.uniform("textureMap", "uniform1i", 1);
		textureMap.bind(1);

		GL.pushMatrix();
		GL.rotate(this.mtx);
		GL.draw(this.mesh);
		GL.popMatrix();
	}


}

export default ViewFloor;