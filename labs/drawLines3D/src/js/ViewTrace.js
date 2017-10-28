// ViewTrace.js

import alfrid, { GL } from 'alfrid';
import VRUtils from './utils/VRUtils';
import Assets from './Assets';

const ratio = 1088 / 656;

class ViewTrace extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.copyFrag);
	}


	_init() {
		const s = 1;
		this.mesh = alfrid.Geom.plane(s, s / ratio, 1, 'xy');

		this.mtx = mat4.create();
		this.texture = Assets.get('trace');
	}


	render() {

		const { gamePads } = VRUtils;
		const gamepad = gamePads.filter( pad => pad.hand === 'left')[0];

		if(!gamepad) {
			return;
		}

		const {buttons, position, orientation} = gamepad;
		const buttonStates = buttons.map( button=> button.pressed);

		if(buttonStates[1]) {
			mat4.fromRotationTranslation(this.mtx, orientation, position);
		}

		GL.rotate(this.mtx);

		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		this.texture.bind(0);
		GL.draw(this.mesh);
	}


}

export default ViewTrace;