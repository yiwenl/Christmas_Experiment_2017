// ViewSim.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/sim.frag';


class ViewSim extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureVel', 'uniform1i', 0);
		this.shader.uniform('texturePos', 'uniform1i', 1);
		this.shader.uniform('textureExtra', 'uniform1i', 2);
		this.shader.uniform("textureLife", "uniform1i", 3);
		this.shader.uniform("textureOrgPos", "uniform1i", 4);
		this.shader.uniform("textureMap", "uniform1i", 5);
	}


	render(textureVel, texturePos, textureExtra, textureLife, textureOrgPos, textureMap) {
		this.time += .01;
		this.shader.bind();
		this.shader.uniform('time', 'float', this.time);
		this.shader.uniform('maxRadius', 'float', params.maxRadius);
		textureVel.bind(0);
		texturePos.bind(1);
		textureExtra.bind(2);
		textureLife.bind(3);
		textureOrgPos.bind(4);
		textureMap.bind(5);

		GL.draw(this.mesh);
	}


}

export default ViewSim;