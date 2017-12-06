// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';
import Assets from './Assets';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.range = 0.001;
		// this.offset = new alfrid.EaseNumber(1, 0.05);
		this.offset = new alfrid.TweenNumber(1, 'expInOut', 0.005);

		gui.add(this, 'open');
		gui.add(this, 'close');
	}


	open() {
		this.offset.value = 0;
	}


	close() {
		this.offset.value = 1;
	}


	_init() {
		const s = 20;
		// this.mesh = alfrid.Geom.sphere(s, 24 * 2, true);
		this.mesh = Assets.get('sphere');
	}


	render() {
		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.bind();
		this.shader.uniform("uRange", "float", this.range);
		GL.draw(this.mesh);
		this.shader.uniform("uOffset", "float", this.offset.value);
		this.shader.uniform("uTime", "float", alfrid.Scheduler.deltaTime);
		GL.gl.cullFace(GL.gl.BACK);
	}


}

export default ViewSphere;