// ViewTrace.js

import alfrid, { GL } from 'alfrid';
import VRUtils from './utils/VRUtils';
import Assets from './Assets';
import States from 'object-states';

const ratio = 1088 / 656;

class ViewTrace extends alfrid.View {
	
	constructor() {
		super(null, alfrid.ShaderLibs.copyFrag);

		this.visible = true;
	}


	_init() {
		const s = 1;
		this.mesh = alfrid.Geom.plane(s, s / ratio, 1, 'xy');

		this.mtx = mat4.create();
		this.texture = Assets.get('trace');

		this._buttonsState = new States({mainPressed:false, triggerPressed:false});
		this._buttonsState.mainPressed.onChange(o => this._onVisibleChange(o));
	}

	_onVisibleChange(o) {
		if(!o) {
			console.log('Visible change');
			this.visible = !this.visible;	
		}
		
	}


	render() {

		const { gamePads } = VRUtils;
		const gamepad = gamePads.filter( pad => pad.hand === 'left')[0];

		if(!gamepad) {
			return;
		}

		const {buttons, position, orientation} = gamepad;
		const buttonStates = buttons.map( button=> button.pressed);

		this._buttonsState.setState({mainPressed:buttonStates[0]});

		if(buttonStates[1]) {
			mat4.fromRotationTranslation(this.mtx, orientation, position);
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