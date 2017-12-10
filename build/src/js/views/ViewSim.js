// ViewSim.js

import alfrid, {GL} from 'alfrid';
import fs from 'shaders/sim.frag';


class ViewSim extends alfrid.View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();

		this.shader.bind();
		this.shader.uniform('textureVel', 'uniform1i', 0);
		this.shader.uniform('texturePos', 'uniform1i', 1);
		this.shader.uniform('textureExtra', 'uniform1i', 2);
		this.shader.uniform('textureMap', 'uniform1i', 3);

	}


	render(textureVel, texturePos, textureExtra, textureMap) {
		this.shader.bind();
		this.shader.uniform('time', 'float', alfrid.Scheduler.deltaTime);
		this.shader.uniform('maxRadius', 'float', params.maxRadius);
		textureVel.bind(0);
		texturePos.bind(1);
		textureExtra.bind(2);
		textureMap.bind(3);


		GL.draw(this.mesh);
	}


}

export default ViewSim;