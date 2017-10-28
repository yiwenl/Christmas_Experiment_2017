// ViewPointer.js

import alfrid, { GL } from 'alfrid';
import Assets from './Assets';

import VRUtils from './utils/VRUtils';

import vs from 'shaders/pointer.vert';
import fs from 'shaders/pointer.frag';

class ViewPointer extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.meshPyramid = Assets.get('pyramid');
		this.meshPointer = Assets.get('pointer');

		this.mtx = mat4.create();
		this.rotation = quat.create();

		this._offset0 = new alfrid.EaseNumber(0);
		this._offset1 = new alfrid.EaseNumber(0);
	}


	render() {
		const { gamePads } = VRUtils;

		gamePads.forEach( (gamepad, i) => {
			const { position, orientation, buttons } = gamepad;
			mat4.fromRotationTranslation(this.mtx, orientation, position);
			const buttonStates = buttons.map( button=> button.pressed);

			this[`_offset${i}`].value = buttonStates[1] ? 1 : 0;


			GL.rotate(this.mtx);

			this.shader.bind();
			this.shader.uniform("offset", "float", 0);
			GL.draw(this.meshPyramid);	

			this.shader.uniform("offset", "float", this[`_offset${i}`].value);
			GL.draw(this.meshPointer);	
		});

		
	}


}

export default ViewPointer;