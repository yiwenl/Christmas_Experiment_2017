// ViewLine.js


import alfrid, { GL } from 'alfrid';
import vs from 'shaders/line.vert';
import vsTest from 'shaders/test.vert';
import fs from 'shaders/line.frag';

class ViewLine extends alfrid.View {
	
	constructor() {
		super(vs, fs);
	}


	_init() {
		this.positions = [];
		this.previous = [];
		this.next = [];
		this.width = [];
		this.side = [];
		this.uvs = [];
		this.counters = [];
		this.indices = [];
		const { sin } = Math;
		const num = 50;
		let count = 0;

		const getPos = (i)=> {
			let x = -num/2 + i;
			let y = sin(i * .2)
			return [x * 0.1, y, 0];
		}

		const points = [];
		let pointsFlat = [];
		for(let i=0; i<num; i++) {
			points.push(getPos(i));
		}

		for(let i=0; i<points.length; i++) {
			this.positions.push(points[i]);
			this.positions.push(points[i]);
			this.counters.push(i/points.length);
			this.counters.push(i/points.length);
		}

		this.mesh = new alfrid.Mesh();
		// this.mesh.bufferVertex(position);
		// this.mesh.bufferIndex(indices);

		this.process();
	}

	compareV3(a, b) {
		let aa = a * 6;
		let ab = b * 6;
		return ( this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );
	} 

	copyV3(a) {
		let aa = a * 6;
		return [ this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ] ];
	}


	process() {
		let l = this.positions.length / 6;

		for(let i=0; i<l; i++) {
			this.side.push(1);
			this.side.push(-1);
		}

		let w = 1;
		for(let i=0; i<l; i++) {
			this.width.push(w);
			this.width.push(w);
		}

		for(let i=0; i<l; i++) {
			this.uvs.push( [i / ( l - 1 ), 0 ]);
			this.uvs.push( [i / ( l - 1 ), 1 ]);
		}

		let v;
		if( this.compareV3( 0, l - 1 ) ){
			v = this.copyV3( l - 2 );
		} else {
			v = this.copyV3( 0 );
		}

		this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		for( var j = 0; j < l - 1; j++ ) {
			v = this.copyV3( j );
			this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
			this.previous.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		}

		for( var j = 1; j < l; j++ ) {
			v = this.copyV3( j );
			this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
			this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		}

		if( this.compareV3( l - 1, 0 ) ){
			v = this.copyV3( 1 );
		} else {
			v = this.copyV3( l - 1 );
		}
		this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );
		this.next.push( v[ 0 ], v[ 1 ], v[ 2 ] );

		for( var j = 0; j < l - 1; j++ ) {
			var n = j * 2;
			this.indices.push( n, n + 1, n + 2 );
			this.indices.push( n + 2, n + 1, n + 3 );
		}

		this.mesh.bufferVertex(this.positions);
		this.mesh.bufferTexCoord(this.uvs);
		this.mesh.bufferIndex(this.indices);

		console.log(this.indices);

		console.log('Side :', this.side.length);
		this.mesh.bufferData(this.previous, 'aPrevious');
		this.mesh.bufferData(this.next, 'aNext');
		this.mesh.bufferData(this.side, 'aSide', 1);
		this.mesh.bufferData(this.width, 'aWidth', 1);
		this.mesh.bufferData(this.counters, 'aCounter');

	}


	render() {
		this.shader.bind();
		this.shader.uniform("uDimension", "vec2", [GL.width, GL.height]);
		GL.draw(this.mesh);
	}


}

export default ViewLine;