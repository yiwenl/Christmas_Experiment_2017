// ViewLine2.js

import alfrid, { GL } from 'alfrid';
import Line from './Line';
import vs from 'shaders/line2.vert';
import fs from 'shaders/line.frag';

class ViewLine2 extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		const getPos = (i)=> {
			let x = -num/2 + i;
			let y = sin(i * .2)
			return [x * 0.1, y, 0];
		}
		const { sin } = Math;
		const num = 50;
		const points = [];
		for(let i=0; i<num; i++) {
			points.push(getPos(i));
		}

		this.mesh = new Line(points, (p)=>{
			return p * 0.2;
		});
	}


	render() {
		this.shader.bind();
		this.shader.uniform("uTime", "float", 0);
		this.shader.uniform("ratio", "float", 0);
		this.shader.uniform("alpha", "float", 1);
		this.shader.uniform("thickness", "float", 1);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
		GL.draw(this.mesh);
	}


}

export default ViewLine2;