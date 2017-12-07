// ViewLine.js


import alfrid, { GL } from 'alfrid';
import vs from 'shaders/line.vert';
import fs from 'shaders/line.frag';

class ViewLine extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.simpleColorFrag);

		this.shader.bind();
		this.shader.uniform({
			color:[1, .8, .5],
			opacity:1
		});
	}


	_init() {
		const points = [];
		const indices = [];
		const { sin } = Math;
		const num = 50;

		const getPos = (i)=> {
			let x = -num/2 + i;
			let y = sin(i * .2)
			return [x * 0.1, y, -.1];
		}
		for(let i=0; i<num; i++) {
			points.push(getPos(i));
			points.push(getPos(i+1));

			indices.push(i * 2, i * 2 + 1);
		}

		this.mesh = new alfrid.Mesh(GL.LINES);
		this.mesh.bufferVertex(points);
		this.mesh.bufferIndex(indices);

	}


	render() {
		this.shader.bind();
		this.shader.uniform("uAspectRatio", "float", GL.aspectRatio);
		GL.draw(this.mesh);
	}


}

export default ViewLine;