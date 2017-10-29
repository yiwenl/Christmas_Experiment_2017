// ViewLines.js

import alfrid, { GL } from 'alfrid';
import fs from 'shaders/lines.frag';
import VRUtils from './utils/VRUtils';

var random = function(min, max) { return min + Math.random() * (max - min);	}

const THRESHOLD_OVERFLOW = 50000;
const MIN_DISTANCE = 0.005;

class ViewLines extends alfrid.View {
	
	constructor() {
		super(null, fs);

		this.index = 0;
		this.pointer = [-999, 0, 0];
		this.lastPosition = vec3.create();
		this._isActivated = true;

		this._rightHand;
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


	_setupGamepad() {
		if(!this._rightHand) {
			if(VRUtils.rightHand) {
				this._rightHand = VRUtils.rightHand;
				this._rightHand.addEventListener('triggerPressed', (e) => this._onTriggerChange(e.detail.pressed));
			} else {
				return;
			}
		}

		const { position } = this._rightHand;

		if(this._rightHand.isTriggerPressed) {
			let dist = vec3.distance(position, this.lastPosition);

			if(dist > MIN_DISTANCE) {
				this.addLine(this.lastPosition, position);
				vec3.copy(this.lastPosition, position);		
			} 
		}

	}


	_onTriggerChange(mPressed) {
		if(!this._isActivated) { return; }
		if(mPressed) {
			//	add line
			const {buttons, position} = this._rightHand;
			this.addLine(position, position);
			vec3.copy(this.lastPosition, position);		

		} else {
			if(this.index > THRESHOLD_OVERFLOW) {
				this._isActivated = false;
				this.dispatchCustomEvent('overflowed');
			}
		}
	}


	render() {
		if(this._isActivated) {
			this._setupGamepad();
		}

		if(!this._rightHand) {
			return;
		}
		

		this.shader.bind();
		GL.draw(this.mesh);
	}


}

export default ViewLines;