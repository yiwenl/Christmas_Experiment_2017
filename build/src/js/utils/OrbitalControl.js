// OrbitalControl.js

import alfrid, { GL } from 'alfrid';

const getMouse = function (mEvent, mTarget) {

	const o = mTarget || {};
	if(mEvent.touches) {
		o.x = mEvent.touches[0].pageX;
		o.y = mEvent.touches[0].pageY;
	} else {
		o.x = mEvent.clientX;
		o.y = mEvent.clientY;
	}

	return o;
};

class OrbitalControl extends alfrid.OrbitalControl {
	constructor(mTarget, mListenerTarget = window, mRadius = 500) {
		super(mTarget, mListenerTarget = window, mRadius = 500);
	}


	_onMove(mEvent) {
		if(this._isLockRotation) { return; }
		getMouse(mEvent, this._mouse);

		mEvent.preventDefault();

		if(this._isMouseDown) {
			let diffX = -(this._mouse.x - this._preMouse.x);
			if(this._isInvert) { diffX *= -1; }
			this._ry.value = this._preRY - diffX * 0.01 * this.sensitivity;

			let diffY = -(this._mouse.y - this._preMouse.y);
			if(this._isInvert) { diffY *= -1; }
			this._rx.value = this._preRX - diffY * 0.01 * this.sensitivity;
		}
	}
}


export default OrbitalControl;