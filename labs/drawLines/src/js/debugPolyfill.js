// debugPolyfill.js

console.log('gui :', window.gui);

if(!window.gui) {
	window.gui = {
		add:()=>{

		}
	};	
}
