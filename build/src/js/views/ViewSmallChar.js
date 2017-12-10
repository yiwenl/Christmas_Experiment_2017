// ViewSmallChar.js

import alfrid, { GL } from 'alfrid';
import Assets from '../Assets';

class ViewSmallChar extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.copyFrag);
		this.mtx = mat4.create();
		mat4.translate(this.mtx, this.mtx, vec3.fromValues(0, -0.75, -4));
	}


	_init() {
		const ratio = 133/381;
		const s = .1;
		this.mesh = alfrid.Geom.plane(s, s/ratio, 1);
		this.texture = Assets.get('smallChar')
	}


	render() {
		GL.pushMatrix();

		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.rotate(this.mtx);
		GL.draw(this.mesh);

		GL.popMatrix();
	}


}

export default ViewSmallChar;