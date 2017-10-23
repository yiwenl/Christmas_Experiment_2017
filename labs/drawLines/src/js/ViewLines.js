// ViewLines.js


import alfrid, { GL } from 'alfrid';
import fs from 'shaders/lines.frag';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewLines extends alfrid.View {
	
	constructor() {
		super(null, fs);

		gui.add(this, 'addLine');

		this.index = 0;
	}


	_init() {
		this.mesh = new alfrid.Mesh(GL.LINES, false);

		const max = 65536;
		const positions = [];
		const indices = [];

		function getPos() {
			return [random(-1, 1), random(-1, 1), random(-1, 1)];
		}

		for(let i=0; i<max; i++) {
			positions.push([0, 0, 0]);
			indices.push(i);
		}

		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex(indices);


	}

	addLine() {

		const offset = this.index * 6 * 4;
		const radiusScale = 0.005;

		let angle = this.index * 0.1;
		let radius = 1.0 + this.index * radiusScale;

		let x = Math.cos(angle) * radius;
		let y = Math.sin(angle) * radius;
		const p0 = [x, y, 0];

		angle = (this.index+1) * 0.1;
		radius = 1.0 + (this.index+1) * radiusScale;

		x = Math.cos(angle) * radius;
		y = Math.sin(angle) * radius;
		const p1 = [x, y, 0];

		this.index+=1;

		this.mesh.bufferSubData('aVertexPosition', offset, [p0, p1]);
	}


	render() {
		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewLines;