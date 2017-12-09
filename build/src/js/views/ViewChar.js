// ViewChar.js
import alfrid, { GL } from 'alfrid';
import Assets from '../Assets';

class ViewChar extends alfrid.View {
	
	constructor(mAssetNames, mModelMatrices) {
		super(null, alfrid.ShaderLibs.simpleColorFrag);
		this._assetNames = mAssetNames;
		this._mtxModels = mModelMatrices;
		this._initMesh();

		this.shader.bind();
		this.shader.uniform({
			color:[1, 1, 1],
			opacity:1
		});
	}


	_initMesh() {
		this._chars = this._assetNames.map( (assetName, i) => {
			return {
				mesh:Assets.get(assetName),
				matrix:this._mtxModels[i]
			}
		});
	}


	render() {
		GL.pushMatrix();
		GL.disable(GL.CULL_FACE);
		this.shader.bind();
		this._chars.forEach( char => {
			GL.rotate(char.matrix);
			GL.draw(char.mesh);
		})

		GL.popMatrix();
		GL.enable(GL.CULL_FACE);
	}


}

export default ViewChar;