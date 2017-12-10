// ViewSpirit.js

import alfrid, { GL } from 'alfrid';
import Assets from '../Assets';
import vs from 'shaders/spirit.vert';
import fs from 'shaders/spirit.frag';

class ViewSpirit extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const ratio = 532/800;
		const s = 1.75;
		this.mesh = alfrid.Geom.plane(s, s/ratio, 1);

		this.texture = Assets.get('spirit');
		this.textureInner = Assets.get('spiritInner');
		this.position = [0, 0, -5];
	}


	render(textureMap, mtxLeftView, mtxLeftProj) {
		this.shader.bind();
		this.shader.uniform("uPosition", "vec3", this.position);
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		this.shader.uniform("textureInner", "uniform1i", 1);
		this.textureInner.bind(1);
		this.shader.uniform("textureMap", "uniform1i", 2);
		textureMap.bind(2);

		this.shader.uniform("uLeftView", "mat4", mtxLeftView);
		this.shader.uniform("uLeftProj", "mat4", mtxLeftProj);
		GL.draw(this.mesh);
	}


}

export default ViewSpirit;