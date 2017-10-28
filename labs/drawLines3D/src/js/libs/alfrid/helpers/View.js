// View.js

import GLShader from '../GLShader';
import EventDispatcher from '../utils/EventDispatcher';

class View extends EventDispatcher {
	constructor(mStrVertex, mStrFrag) {
		super();
		this.shader = new GLShader(mStrVertex, mStrFrag);

		this._init();
	}


	//	PROTECTED METHODS

	_init() {

	}

	// 	PUBLIC METHODS

	render() {

	}
}

export default View;