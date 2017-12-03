// ViewSpirit.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';
import vs from 'shaders/spirit.vert';
import fs from 'shaders/spirit.frag';
const ratio = 532/800;

class ViewSpirit extends alfrid.View {
	
	constructor() {
		super(null, fs);
	}


	_init() {
		const s = 1;
		this.mesh = alfrid.Geom.plane(s, s/ratio, 1);
		this.texture = Assets.get('spirit');
		this.textureInner = Assets.get('spiritInner');
	}


	render(textureMap) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("textureInner", "uniform1i", 1);
		this.textureInner.bind(1);
		this.shader.uniform("textureMap", "uniform1i", 2);
		textureMap.bind(2);
		this.shader.uniform("uDimension", "vec2", [GL.width, GL.height]);
		GL.draw(this.mesh);
	}


}

export default ViewSpirit;