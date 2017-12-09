// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';
import Assets from './Assets';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.range = 0.01;

		this.cameraSphere = new alfrid.CameraPerspective();
		this.cameraSphere.setPerspective(Math.PI/2, GL.aspectRatio, .1, 1000);
		this.orbControlSphere = new alfrid.OrbitalControl(this.cameraSphere, window, .01);
		const easing = 0.1;
		this.orbControlSphere.rx.easing = easing;
		this.orbControlSphere.ry.easing = easing;
		this.orbControlSphere.lockZoom(true);
	}


	_init() {
		this.mesh = Assets.get('sphere');
	}


	render() {
		GL.pushMatrix();
		GL.gl.cullFace(GL.gl.FRONT);
		this.shader.bind();
		this.shader.uniform("uRange", "float", this.range);
		GL.rotate(this.cameraSphere.matrix);


		GL.draw(this.mesh);
		GL.gl.cullFace(GL.gl.BACK);
		GL.popMatrix();
	}


}

export default ViewSphere;