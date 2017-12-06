import alfrid, { GL } from 'alfrid';

let gl, pivotX, pivotY, axis;

let tempArray1 = [];
let tempArray2 = [];
let tempArray3 = [];
class Line extends alfrid.Mesh {
  constructor(vertices, c, drawMode = GL.TRIANGLES){

    gl = GL;
      super(drawMode)
    this.widthCallback = c;

    // indices = [];
    let vert = [
      [0, 0, 0],
      [100/800, 250/800, 0],
      [50/800, 200/800 ,0],
      [0, 200/800 ,0],
      [-100/800, 220/800 ,0],
      [-70/800, 300/800 ,0]
    ];


    this.positions = [];
    this.directions = [];
    this.indicesArray = [];
    this.counters = [];
    this.width = [];
    this.uvs = [];
    this.previous = [];
  	this.next = [];


    this.vert = vertices || vert;


    this.line(true);

  }

  line(needsUpdate = true){

    let v = this.vert;

    this.positions.length = v.length * 2;
    this.counters.length = v.length * 2;

    var index = 0;
    var indexC = 0;
    var indexP = 0;
    var indexN = 0;



    this.previous.length = this.positions.length;
    this.next.length = this.positions.length;





    for (var i = 0; i < v.length; i++) {


      if(needsUpdate){
        var c = i/v.length;
        this.counters[indexC++] = [c];
        this.counters[indexC++] = [c];
      }

      // console.log(this.positions.length);
      this.positions[index++] = v[i][0];
      this.positions[index++] = v[i][1];
      this.positions[index++] = v[i][2];

      this.positions[index++] = v[i][0];
      this.positions[index++] = v[i][1];
      this.positions[index++] = v[i][2];



    }




    this.process(needsUpdate);
  }

  compareV3( a, b ) {
  	var aa = a * 6;
  	var ab = b * 6;
    // console.log(this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );
  	return ( this.positions[ aa ] === this.positions[ ab ] ) && ( this.positions[ aa + 1 ] === this.positions[ ab + 1 ] ) && ( this.positions[ aa + 2 ] === this.positions[ ab + 2 ] );
  }

  copyV3( a, out ) {

    if(!out) out = tempArray1;

	  var aa = a * 6;
    // console.log(this.positions[ aa ], this.positions[ aa + 1 ], this.positions[ aa + 2 ]);
    out[0] = this.positions[ aa ];
    out[1] = this.positions[ aa + 1 ];
    out[2] = this.positions[ aa + 2 ];

  }

  process(needsUpdate){

    // console.log("here");
    var l = this.positions.length / 6;

    var v, index = 0, indexN = 0;

    // this.next = [];

    if( this.compareV3( 0, l - 1 ) ){
      this.copyV3( l - 2 );
    } else {
      this.copyV3( 0 );
    }

    this.previous[index++] = tempArray1[0];
    this.previous[index++] = tempArray1[1];
    this.previous[index++] = tempArray1[2];

    this.previous[index++] = tempArray1[0];
    this.previous[index++] = tempArray1[1];
    this.previous[index++] = tempArray1[2];

    for (var i = 0; i < l; i++) {
      // caluclate pos and next
      this.copyV3( i, tempArray1 );

      if(i > 0) {
        // we can fill the nexts
        this.next[indexN++] = tempArray1[0];
        this.next[indexN++] = tempArray1[1];
        this.next[indexN++] = tempArray1[2];

        this.next[indexN++] = tempArray1[0];
        this.next[indexN++] = tempArray1[1];
        this.next[indexN++] = tempArray1[2];

        this.previous[index++] = tempArray2[0];
        this.previous[index++] = tempArray2[1];
        this.previous[index++] = tempArray2[2];

        this.previous[index++] = tempArray2[0];
        this.previous[index++] = tempArray2[1];
        this.previous[index++] = tempArray2[2];
      }

      tempArray2[0] = tempArray1[0];
      tempArray2[1] = tempArray1[1];
      tempArray2[2] = tempArray1[2];
    }

    if( this.compareV3( l - 1, 0 ) ){
      this.copyV3( 1, tempArray1 );
    } else {
      this.copyV3( l - 1, tempArray1 );
    }

    this.next[indexN++] = tempArray1[0];
    this.next[indexN++] = tempArray1[1];
    this.next[indexN++] = tempArray1[2];

    this.next[indexN++] = tempArray1[0];
    this.next[indexN++] = tempArray1[1];
    this.next[indexN++] = tempArray1[2];



    index = 0;

    this.bufferFlattenData(this.positions, 'aVertexPosition', 3, false);
    this.bufferFlattenData(this.next, 'aNext', 3, false);
    this.bufferFlattenData(this.previous, 'aPrevious', 3, false);
    this.bufferFlattenData(this.positions, 'aNormal', 3, false);



    if(needsUpdate){
      index = 0;
      this.uvs = [];
      let w;
      for( var j = 0; j < l; j++ ) {

        if( this.widthCallback ){
          w = this.widthCallback( j / ( l -1 ) )
        }
        else {
          w = .1;
        }

        this.width[index++] = w;
        this.width[index++] = w;

        this.uvs.push([j/(l-1), 0]);
        this.uvs.push([j/(l-1), 1]);
      }

      index = 0;
      this.indicesArray = [];
      for( var j = 0; j < l - 1; j++ ) {
        var n = j * 2;

        this.indicesArray[index++] = n;
        this.indicesArray[index++] = n+1;
        this.indicesArray[index++] = n+2;

        this.indicesArray[index++] = n+2;
        this.indicesArray[index++] = n+1;
        this.indicesArray[index++] = n+3;
      }

      index = 0;
      this.directions = [];
      for (var i = 0; i < this.positions.length; i++) {
        if(i % 2 === 0){
          this.directions[index++] = [1];
        }
        else {
          this.directions[index++] = [-1];
        }
      }

      this.bufferIndex(this.indicesArray);
      this.bufferFlattenData(this.width, 'width', 1);
      this.bufferData(this.directions, 'direction', 1);
      this.bufferTexCoord(this.uvs);
      this.bufferData(this.counters, 'aCounters', 1);
    }

  }

  render(points, needsUpdate = false){

    this.vert = points || this.vert;

    this.line(needsUpdate);
  }
}

export default Line;
