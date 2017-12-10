// ViewSphere.js

import alfrid, { GL } from 'alfrid';
import Assets from '../Assets';
import vs from 'shaders/sphere.vert';
import fs from 'shaders/sphere.frag';
import VRUtils from '../utils/VRUtils';

class ViewSphere extends alfrid.View {
	
	constructor() {
		super(vs, fs);

		this.range = 0.002;
	}


	_init() {
		this.mesh = Assets.get('sphere');

		//	get control

		this._useGamepad = false;
		if(VRUtils.hasVR && !GL.isMobile) {
			this._useGamepad = true;
			this.mtx = mat4.create();
		} else {
			this.cameraSphere = new alfrid.Camera();
			// this.cameraSphere.setPerspective(Math.PI * 0.25, GL.aspectRatio, .1, 100);
			this.orbControlSphere = new alfrid.OrbitalControl(this.cameraSphere, window, .01);
			const easing = 0.1;
			this.orbControlSphere.radius.value = .1;
			// this.orbControlSphere.ry.value = Math.PI;
			this.orbControlSphere.rx.easing = easing;
			this.orbControlSphere.ry.easing = easing;
			this.orbControlSphere.lockZoom(true);
		}

		/*
		
		if(hasVR && hasGamePad)
			use gamepad orientation to control
		else 
			use orbitalcontrol
		*/
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


	render(mtxProj) {
		GL.gl.cullFace(GL.gl.FRONT);
		GL.pushMatrix();

		if(this._useGamepad) {

			this._checkGamePad();
			// if(!this._gamepad) {
			// 	return;
			// }

			GL.rotate(this.mtx);
		} else {
			GL.rotate(this.cameraSphere.matrix);
		}

		this.shader.bind();
		this.shader.uniform("uRange", "float", this.range);
		this.shader.uniform("uLeftProj", "mat4", mtxProj);
		GL.draw(this.mesh);
		GL.popMatrix();
		GL.gl.cullFace(GL.gl.BACK);
	}


}

export default ViewSphere;