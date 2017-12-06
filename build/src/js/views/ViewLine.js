// ViewLine2.js

import alfrid, { GL } from 'alfrid';
import Line from './Line';
import vs from 'shaders/line2.vert';
import fs from 'shaders/line.frag';
import VRUtils from '../utils/VRUtils';

const THRESHOLD_OVERFLOW = 50000;
const MIN_DISTANCE = 0.005;

class ViewLine2 extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.index = 0;
		this.pointer = [-999, 0, 0];
		this._rightHand;
		this.lastPosition = vec3.create();
		this._isActivated = true;
		this._savedPositions = [];

		this.shader.bind();
		this.shader.uniform("uTime", "float", 0);
		this.shader.uniform("ratio", "float", 0);
		this.shader.uniform("alpha", "float", 1);
		this.shader.uniform("thickness", "float", 1);
		
	}


	_init() {
	}


	update(points) {
		if(!this.mesh) {
			this.mesh = new Line(points, (p)=>{
				return p * 0.05;
			});
		}

		this.mesh.render(points, true);
	}


	_setupGamepad() {
		if(!this._rightHand) {
			if(VRUtils.rightHand) {
				this._rightHand = VRUtils.rightHand;
				this._rightHand.addEventListener('triggerPressed', (e) => this._onTriggerChange(e.detail.pressed));
				this._rightHand.addEventListener('triggerReleased', (e) => this._onTriggerReleased(e.detail.pressed));
			} else {
				return;
			}
		}

		const { position } = this._rightHand;

		if(this._rightHand.isTriggerPressed) {
			let dist = vec3.distance(position, this.lastPosition);

			if(dist > MIN_DISTANCE) {
				const p = vec3.clone(position);
				this._savedPositions.push(p);
				vec3.copy(this.lastPosition, position);		

				this.update(this._savedPositions);
			} 
		}

	}


	_onTriggerChange(mPressed) {
		console.log('Trigger change :', mPressed);
		if(!this._isActivated) { return; }
		if(mPressed) {
			//	add line
			const {buttons, position} = this._rightHand;
			// this.addLine(position, position);
			const p = vec3.clone(position);
			this._savedPositions.push(p);
			vec3.copy(this.lastPosition, position);		

		} else {
			
		}
	}

	_onTriggerReleased() {
		this._isActivated = false;
		this.dispatchCustomEvent('overflowed');
	}


	render() {
		if(this._isActivated) {
			this._setupGamepad();
		}

		if(!this._rightHand) {
			return;
		}

		if(!this.mesh) {
			return;
		}

		this.shader.bind();
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
		GL.draw(this.mesh);
	}


	get points() {
		return this._savedPositions;
	}


}

export default ViewLine2;