import '../scss/global.scss';
import alfrid, { GL } from 'alfrid';
import SceneApp from './SceneApp';
import AssetsLoader from 'assets-loader';
import dat from 'dat-gui';
import Stats from 'stats.js';
import assets from './asset-list';
import Assets from './Assets';
import VRUtils from './utils/VRUtils';
import Sono from './libs/sono';


if(document.body) {
	_init();
} else {
	window.addEventListener('DOMContentLoaded', _init);
}


window.params = {
	numParticles:256 * 2,
	maxRadius: 0.25
};

window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);



function _init() {

	//	LOADING ASSETS
	if(assets.length > 0) {
		document.body.classList.add('isLoading');

		const loader = new AssetsLoader({
			assets:assets
		})
		.on('error', (error)=>{
			console.log('Error :', error);
		})
		.on('progress', (p) => {
			// console.log('Progress : ', p);
			const loader = document.body.querySelector('.Loading-Bar');
			if(loader) loader.style.width = `${(p * 100)}%`;
		})
		.on('complete', _onImageLoaded)
		.start();

	} else {
		_initVR();
	}

}

let scene;

function _onImageLoaded(o) {
	//	ASSETS
	console.log('Image Loaded : ', o);
	window.assets = o;
	const loader = document.body.querySelector('.Loading-Bar');
	loader.style.width = '100%';

	console.log('DEBUG :', window.debug);

	_initVR();

}


function _initVR() {
	VRUtils.init( (vrDisplay) => _onVR(vrDisplay));
}

function _onVR(vrDisplay) {
	if(vrDisplay != null && VRUtils.canPresent) {
		if(!GL.isMobile) {
			document.body.classList.add('hasVR');	
		}
		
		let btnVR = document.body.querySelector('#enterVr');
		btnVR.addEventListener('click', ()=> {
			VRUtils.present(GL.canvas, ()=> {
				document.body.classList.add('present-vr')
				scene.resize();
			});
		});
	} else {
		//	do nothing
	}


	
	_init3D();

	const btnStart = document.body.querySelector('.enter');
	btnStart.addEventListener('click', (e)=> {
		document.body.classList.add('isClosingTitle');
		setTimeout(_enterExp, 1000);
	});


	if(window.debug) {
		_enterExp();
	} else {
		_showTitle();
	}

}


function _enterExp() {
	document.body.classList.add('hasShownTitle');	
	document.body.classList.remove('isClosingTitle');	
	document.body.classList.remove('isShowingTitle');	
	document.body.classList.remove('isLoading');

	const sound = Sono.createSound('./assets/audio/background.mp3');
	sound.loop = true;
	sound.play();

	if(window.debug) {
		sound.volume = 0.001;
	}

	window.addEventListener('mousedown', onDown);
	window.addEventListener('touchstart', onDown);
}

function _showTitle() {
	setTimeout(()=> {
		document.body.classList.remove('isLoading');
		document.body.classList.add('isShowingTitle');	
	}, 250);
}

function _init3D() {
	//	CREATE CANVAS
	const canvas = document.createElement('canvas');
	canvas.className = 'Main-Canvas';
	document.body.appendChild(canvas);

	//	INIT 3D TOOL
	GL.init(canvas, {ignoreWebgl2:true, alpha:false});
	GL.enableAlphaBlending();

	if(GL.isMobile) {
		params.numParticles = 128;
		document.body.classList.add('is-mobile');	
	}

	//	INIT ASSETS
	Assets.init();

	//	INIT DAT-GUI
	// window.gui = new dat.GUI({ width:300 });

	//	CREATE SCENE
	scene = new SceneApp();

	window.addEventListener("touchmove",function(e){e.preventDefault()},{passive:!1});

	// addEventListener(document, "touchmove", function(e) {
	//     console.log(e.defaultPrevented);  // will be false
	//     e.preventDefault();   // does nothing since the listener is passive
	//     console.log(e.defaultPrevented);  // still false
	// }, {passive: false});
	// }, false);
}


function onDown() {
	document.body.classList.add('hasInteracted');	
}