// ViewSphereOpening.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/sphereOpening.vert';
import fs from 'shaders/sphereOpening.frag';
import Assets from './Assets';

class ViewSphereOpening extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.offset = new alfrid.TweenNumber(1, 'expInOut', .005);
		gui.add(this, 'open');
		gui.add(this, 'close');

		this.visible = true;
	}


	open() {
		this.offset.value = 0.0;
	}

	close() {
		this.offset.value = 1.0;
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(5, 24, true);
		this.texture = Assets.get('sphereMap');
		this.texture.wrapT = GL.MIRRORED_REPEAT;
	}


	render() {
		if(!this.visible) {
			return;
		}
		this.shader.bind();
		this.shader.uniform("uOffset", "float", this.offset.value);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewSphereOpening;