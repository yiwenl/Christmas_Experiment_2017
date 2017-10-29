// ViewTrace.js

import alfrid, { GL } from 'alfrid';
import VRUtils from './utils/VRUtils';
import Assets from './Assets';

const ratio = 1088 / 656;

class ViewTrace extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.copyFrag);

		this.visible = false;

		this._gamepad;
	}


	_init() {
		const s = 1;
		this.mesh = alfrid.Geom.plane(s, s / ratio, 1, 'xy');

		this.mtx = mat4.create();
		this.texture = Assets.get('trace');
	}


	_onVisibleChange(o) {
		this.visible = !this.visible;	
	}


	_checkGamepad() {
		if(!this._gamepad) {
			console.log(VRUtils.leftHand);
			if(VRUtils.leftHand) {
				this._gamepad = VRUtils.leftHand;

				this._gamepad.addEventListener('mainButtonPressed', (e)=>this._onVisibleChange(e.detail.pressed));
				this._gamepad.addEventListener('mainButtonPressed', (e)=> {
					console.log('Main button pressed', e.detail.pressed);
				});
			} else {
				return;
			}
		}
	}


	render() {
		this._checkGamepad();
		if(!this._gamepad) {
			return;
		}

		if(this._gamepad.isTriggerPressed) {
			mat4.copy(this.mtx, this._gamepad.mtx);
		}
		GL.rotate(this.mtx);

		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);

		if(this.visible) {
			GL.draw(this.mesh);	
		}
		
	}


}

export default ViewTrace;