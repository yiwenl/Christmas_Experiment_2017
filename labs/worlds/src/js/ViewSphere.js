// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';
import VRUtils from './utils/VRUtils';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);


		this.mtx = mat4.create();
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(32, 24, true);
	}

	_checkGamePad() {
		if(!this._gamepad) {
			if(VRUtils.rightHand) {
				this._gamepad = VRUtils.rightHand;
			} else if(VRUtils.leftHand) {
				this._gamepad = VRUtils.leftHand;
			} else {
				return;
			}
		}
		
		mat4.fromQuat(this.mtx, this._gamepad.orientation);

	}


	render() {
		this._checkGamePad();
		if(!this._gamepad) {
			return;
		}

		this.shader.bind();
		this.shader.uniform("uOrientation", "mat4", this.mtx);
		GL.draw(this.mesh);
	}


}

export default ViewSphere;