// ViewChar.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

class ViewChar extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.copyFrag);
	}


	_init() {
		const ratio = 532 / 800;
		const s = 10;
		this.mesh = alfrid.Geom.plane(s, s/ratio, 1);
		this.texture = Assets.get('spirit');
		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, 2, -3));
	}


	render() {
		GL.pushMatrix();

		GL.rotate(this.mtx);
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		
		GL.draw(this.mesh);
		GL.popMatrix();
	}


}

export default ViewChar;