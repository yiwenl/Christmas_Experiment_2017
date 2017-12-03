// ViewSim.js

import alfrid from 'alfrid';
const GL = alfrid.GL;
const fsSim = require('../shaders/sim.frag');


class ViewSim extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fsSim);
		this.time = Math.random() * 0xFF;
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('texturePos', 'uniform1i', 0);
		this.shader.uniform('textureVel', 'uniform1i', 1);
		this.shader.uniform('textureExtra', 'uniform1i', 2);
		this.shader.uniform("textureMap", "uniform1i", 3);
		
		this.shader.uniform("uBoundary", "vec3", params.innerBoundary);
		this.shader.uniform("uBoundaryOffset", "vec3", params.innerOffset);
	}


	render(fbo, textureMap) {
		this.time += .01;
		this.shader.bind();
		this.shader.uniform('time', 'float', this.time);
		this.shader.uniform('maxRadius', 'float', params.maxRadius);
		fbo.getTexture(0).bind(0);
		fbo.getTexture(1).bind(1);
		fbo.getTexture(2).bind(2);
		textureMap.bind(3);

		GL.draw(this.mesh);
	}


}

export default ViewSim;