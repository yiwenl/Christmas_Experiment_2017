// SubsceneChars.js

import alfrid, { GL } from 'alfrid';
import ViewLine from './views/ViewLine';

import pointsData from './data/points.json';

class SubsceneChars {
	constructor(parentScene) {
		this._parent = parentScene;

		this._init();
	}

	_init() {

		this._lines = [];
		console.log(pointsData);
		let m = mat4.create();
		mat4.rotateY(m, m, .9);
		mat4.rotateZ(m, m, .15);
		// mat4.rotateX(m, m, -.25);
		mat4.translate(m, m, vec3.fromValues(.5, -1.5, -1));

		pointsData.forEach( (lineData, i) => {
			const line = new ViewLine([1, 1, 1], m);
			this._lines.push(line);
			line.load(lineData);
		});
	}

	render() {
		this._lines.forEach( line => line.render() );
	}
}


export default SubsceneChars;