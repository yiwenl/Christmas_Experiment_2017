// ViewLines.js


import alfrid, { GL } from 'alfrid';
import fs from 'shaders/lines.frag';
import VRUtils from './utils/VRUtils';

var random = function(min, max) { return min + Math.random() * (max - min);	}

class ViewLines extends alfrid.View {
	
	constructor() {
		super(null, fs);

		gui.add(this, 'addLine');

		this.index = 0;

		this.lastPosition = vec3.create();
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

	addLine(a, b) {
		const offset = this.index * 6 * 4;
		const p0 = vec3.clone(a);
		const p1 = vec3.clone(b);

		this.index+=1;

		this.mesh.bufferSubData('aVertexPosition', offset, [p0, p1]);
	}


	render() {

		const { gamePads } = VRUtils;
		const gamepad = gamePads[0];
		if(!gamepad) {
			return;
		}

		const {buttons, position} = gamepad;
		const buttonStates = buttons.map( button=> button.pressed);
		if(buttonStates[1]) {
			let dist = vec3.distance(position, this.lastPosition);

			if(dist > 0.001) {
				this.addLine(this.lastPosition, position);
				vec3.copy(this.lastPosition, position);		
			}
		}

		// console.log(buttonStates);
		this.pointer = position;
		


		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewLines;