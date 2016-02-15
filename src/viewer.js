import THREE from 'three'
import loop from 'raf-loop'

import assign from 'object-assign'
import domready from 'domready'
import fitter from 'canvas-fit'

import FboMaterial from './fbo'
import TexturePlane from './texplane'
import Toolbelt from './shaders/toolbelt/index'

const OrbitControls = require('three-orbit-controls')(THREE)

var glslify = require('glslify')


export default function(opt,tex) {
  var hasUserMedia = navigator.webkitGetUserMedia ? true : false;
  let webcam      = document.createElement('video');

  webcam.width    = 512;
  webcam.height   = 512;
  webcam.autoplay = true;

  navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

  // navigator.getUserMedia({video:true, audio:false}, function(stream){
  //   console.log('HELLO');
  //   webcam.src    = window.URL.createObjectURL(stream);
  // }, function(error){
  //   console.log("Failed to get a stream due to", error);
  // });

  let mouse = new THREE.Vector2();
  let mouseX, mouseY, unMappedMouseX, unMappedMouseY;
  opt = assign({}, opt)

  let time = 0;

  const dpr = Math.min(2, window.devicePixelRatio)
  const canvas = opt.canvas || document.createElement('canvas')
  const fit = fitter(canvas, window, dpr)

  const renderer = new THREE.WebGLRenderer(assign({
    canvas: canvas
  }, opt));


  let scene, camera, texture, material, controls;

  let texturePlane, texturePlane2, texturePlane3, texturePlane4;

  let angle = 0,
	speed = 0.02,
	centerY = 20,
	waveHeight = 150;

  // let vidTex = new THREE.Texture( vid );
  // vidTex.minFilter = THREE.LinearFilter;
	// vidTex.magFilter = THREE.LinearFilter;
	// vidTex.format = THREE.RGBFormat;
  //
  // let vidTex2 = new THREE.Texture( webcam );
  // vidTex2.minFilter = THREE.LinearFilter;
	// vidTex2.magFilter = THREE.LinearFilter;
	// vidTex2.format = THREE.RGBFormat;


  // let fboTex = new THREE.Texture(canvasTexture.canvas);
  // fboTex.needsUpdate = true;

  const gl = renderer.getContext();

  const app = loop(draw);


  assign(app, {
    renderer,
    gl,
    canvas
  })

  window.addEventListener('resize', resize, false)
  document.addEventListener('mousemove', onDocumentMouseMove, false );
  document.addEventListener('keydown', onClick, false );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0)

  process.nextTick(resize)

  init();

  return app

  function onClick(event) {
    if (event.keyCode === 77) {
      console.log(camera.rotation);
      console.log(camera.position);
    }

    if (event.keyCode === 81) {
      texturePlane.mesh.rotation.z += 0.05;
    }

    if (event.keyCode === 69) {
      texturePlane.mesh.rotation.z += -0.05;

    }
  }
  function init () {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100000 );
    // camera = new THREE.OrthographicCamera(window.innerWidth/ - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -100000, 100000 );
    controls = new OrbitControls(camera, canvas);
    camera.position.x = -0.6847855613532225;
    camera.position.y = -448.0737002735632;
    camera.position.z = 135.14274305079847;

    camera.rotation.x = 1.34;
    camera.rotation.y = 0.00;
    camera.rotation.z = 0.00;
    // let ambientLight = new THREE.AmbientLight( 0xffffff );
    // scene.add( ambientLight );
    texturePlane = new TexturePlane(scene, camera, renderer, tex, null);
    // texturePlane2 = new TexturePlane(scene, camera, renderer, tex, null);
    // texturePlane3 = new TexturePlane(scene, camera, renderer, tex, null);
    // texturePlane4 = new TexturePlane(scene, camera, renderer, tex, null);

    // camera.lookAt(new THREE.Vector3(0,0,0))
    // texturePlane.setRotation(new THREE.Vector3(2.0,0,0))
    texturePlane.setPosition(new THREE.Vector3(0,0,0))

    // texturePlane2.setRotation(new THREE.Vector3(2.0,0,0))
    // texturePlane2.setPosition(new THREE.Vector3(0,0,250.0))
    // texturePlane3.setPosition(new THREE.Vector3(0,0,0))
    // texturePlane3.setRotation(new THREE.Vector3(2.0,0,0))
    // texturePlane4.setPosition(new THREE.Vector3(0,0,0))
    // texturePlane4.setRotation(new THREE.Vector3(2.0,0,0))
    // var cameraHelper = new THREE.CameraHelper(camera);
    // scene.add(cameraHelper);
    let ambientLight = new THREE.AmbientLight( 0xED9AC7 );
		scene.add( ambientLight );

    let directionalLight2 = new THREE.DirectionalLight( 0x6E768B, 0.55 );
		directionalLight2.position.set( 0, 0.0, 500.0 );
		scene.add( directionalLight2 );

    //
		let directionalLight = new THREE.DirectionalLight( 0xACBCE5 );
		directionalLight.position.set( 0, 500.0, 500.0 );
		scene.add( directionalLight );

    // var lightHelper = new THREE.DirectionalLightHelper(directionalLight,50);
    // scene.add( lightHelper );
  }

  function draw () {
    app.emit('render')

    time += 0.01;
    // console.log(time);


    // vidTex.needsUpdate = true;
    // vidTex2.needsUpdate = true;

    let timeInCurrentMin = time.toFixed(0) > 60.0 ? (time.toFixed(0) - (Math.floor(time.toFixed(0)/60)*60)) : time.toFixed(0);
    // console.log(((mouseX+mouseY)/2));
    // texturePlane.material.displacementScale = 10 + (Math.sin(time)*150);
    // texturePlane2.material.displacementScale = 10 + -(Math.sin(time)*150);

    // camera.position.z = 1200 + (Math.sin(time/2)*100);
    // texturePlane.mesh.rotation.x = (23.5/180)*Math.PI;
    // texturePlane.mesh.rotation.z += 0.005;
    // texturePlane2.mesh.rotation.z += -0.005;
    texturePlane.mesh.rotation.z += -0.001;

    // texturePlane.material.uniforms.mouse.value = new THREE.Vector2(window.innerWidth/2, window.innerHeight/2);
    // texturePlane.material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);
    // texturePlane.material.uniforms.time.value = time;



    renderer.render(scene, camera);
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
  }

  function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
    mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;

    unMappedMouseX = (event.clientX );
    unMappedMouseY = (event.clientY );
    mouseX = map(unMappedMouseX, window.innerWidth, -1.0,1.0);
    mouseY = map(unMappedMouseY, window.innerHeight, -1.0,1.0);
  }

}
