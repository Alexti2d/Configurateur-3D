import * as THREE from 'three';

import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from "./node_modules/three/examples/jsm/loaders/RGBELoader.js";
let camera, scene, renderer, canvas;
init();
animate();




function init() {
	canvas = document.getElementById('renderer');


	const rGBELoader = new RGBELoader()
	const ChaiseMesh = new OBJLoader()
	var mTLLoader = new MTLLoader()

	const BtnOrange = document.getElementById('BtnOrange');
	BtnOrange.addEventListener('click', e => {MajChair("Orange")});

	const BtnBlue = document.getElementById('BtnBlue');
	BtnBlue.addEventListener('click', e => {MajChair("Blue")});

	const BtnWhite = document.getElementById('BtnWhite');
	BtnWhite.addEventListener('click', e => {MajChair("White")});

	const BtnGray = document.getElementById('BtnGray');
	BtnGray.addEventListener('click', e => {MajChair("Gray")});
	
	camera = new THREE.PerspectiveCamera( 45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 20 );
	camera.position.z = 3.5;
	camera.position.y = 5;

	// scene
	scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    // hemiLight.position.set(0, 20, 0);
    // scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(6, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

	const ambientLight = new THREE.AmbientLight( 0xffffff );
    ambientLight.castShadow = true;
	scene.add( ambientLight );

	const pointLight = new THREE.PointLight( 0xffffff, 15 );

	camera.add( pointLight );
	scene.add( camera );

	// Si ont veut ajouter un sol

    // const mesh = new THREE.Mesh(
    //     new THREE.PlaneGeometry(200, 200),
    //     new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    // );

    // mesh.rotation.x = -Math.PI / 2;
    // mesh.position.y = -0.5;
    // mesh.receiveShadow = true;
    // scene.add(mesh);

	// model

	const onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log( percentComplete.toFixed( 2 ) + '% downloaded' );
		}
	};

	

	MajChair("Blue")
	
	function MajChair(couleur) {

		rGBELoader
        .load("obj/plan.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
			ChaiseMesh.load( 'obj/chair.obj', function ( chaise ) {
				chaise.scale.setScalar( 0.001 );
				chaise.position.y = - 0.95;
				chaise.castShadow = true;
				chaise.receiveShadow = true;            
				scene.add(chaise);
			}, onProgress );
		});
    
		mTLLoader.load( 'obj/chair' + couleur + '.mtl', function ( materials ) {
			materials.preload();
			ChaiseMesh.setMaterials( materials )
		});
		console.log(couleur)
			
	}


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	// renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
	canvas.appendChild( renderer.domElement );

	const controls = new  OrbitControls( camera, renderer.domElement );
	controls.minDistance = 2;
	controls.maxDistance = 5;

	window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
	camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}