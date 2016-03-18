import THREE from 'three'
import loop from 'raf-loop'

import assign from 'object-assign'
import domready from 'domready'
import fitter from 'canvas-fit'

import FboMaterial from './fbo'
import TexturePlane from './texplane'
import Toolbelt from './shaders/toolbelt/index'

import Howler from 'howler'

import { EffectComposer, RenderPass, BloomPass, FilmPass, BokehPass } from 'postprocessing';

const OrbitControls = require('three-orbit-controls')(THREE)

var glslify = require('glslify')

var Howl = Howler.Howl;

export default function(opt, terrainPack) {
  let currentSound = null;
  // var hasUserMedia = navigator.webkitGetUserMedia ? true : false;
  // let webcam      = document.createElement('video');
  //
  // webcam.width    = 512;
  // webcam.height   = 512;
  // webcam.autoplay = true;
  //
  // navigator.getUserMedia = navigator.getUserMedia ||
  //                        navigator.webkitGetUserMedia ||
  //                        navigator.mozGetUserMedia;
  //
  // // navigator.getUserMedia({video:true, audio:false}, function(stream){
  // //   console.log('HELLO');
  // //   webcam.src    = window.URL.createObjectURL(stream);
  // // }, function(error){
  // //   console.log("Failed to get a stream due to", error);
  // // });
  // let terrainName = tex[0].name;

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

  let texturePlane;//, texturePlane2, texturePlane3, texturePlane4;
  let terrainName, terrainIndex;

  var composer;


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

  // window.addEventListener('resize', resize, false)
  document.addEventListener('mousemove', onDocumentMouseMove, false );
  document.addEventListener('keydown', onClick, false );
  renderer.setSize(1024, 576);
  renderer.setClearColor(0x000000, 0)

  // process.nextTick(resize)

  init();

  return app

  function onClick(event) {
    if (event.keyCode === 77) {
      console.log(camera.rotation);
      console.log(camera.position);
    }
    if (event.keyCode === 80) {
      console.log(texturePlane.mesh.rotation);
      console.log(texturePlane.mesh.position);

    }
    if (event.keyCode === 81) {
      texturePlane.mesh.rotation.z += 0.05;
    }

    if (event.keyCode === 69) {
      texturePlane.mesh.rotation.z += -0.05;
    }

    if (event.keyCode === 76) {
      nextTerrain();
    }
    if (event.keyCode === 75) {
      prevTerrain();
    }

  }
  function nextTerrain() {
    if (terrainIndex < 3) {
      terrainIndex++;
      let terrain = terrainPack[terrainIndex];
      terrainName = terrain.name;
      setTerrain(terrain, scene, camera);
      setPost();
    }
  }
  function prevTerrain() {
    if (terrainIndex > 0) {
      terrainIndex--;
      let terrain = terrainPack[terrainIndex];
      terrainName = terrain.name;
      setTerrain(terrain, scene, camera);
      setPost();
    }

  }
  function init () {
    console.log('y')

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100000 );
    // camera = new THREE.OrthographicCamera(window.innerWidth/ - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -100000, 100000 );
    // controls.enabled= false;
    controls = new OrbitControls(camera, canvas);
    controls.enabled = false;
    terrainIndex = 0;
    let initTerrain = terrainPack[terrainIndex];
    terrainName = initTerrain.name;

    let ambientLight = new THREE.AmbientLight( 0x878463 );
    scene.add( ambientLight );

    let directionalLight2 = new THREE.DirectionalLight( 0x6E768B, 1.0 );
    directionalLight2.position.set( 0, 0.0, 500.0 );
    scene.add( directionalLight2 );

    //
    let directionalLight = new THREE.DirectionalLight( 0x58663D , 1.5);
    directionalLight.position.set( 200.0, 400.0, 600.0 );
    scene.add( directionalLight );

    setTerrain(initTerrain, scene, camera);
    setPost();

  }
  function setPost () {
    composer = new EffectComposer(renderer);
    var renderPass = new RenderPass(scene, camera);

    if (terrainName === 'polar_dunes') {

      composer.addPass(renderPass);
      var filmPass = new FilmPass({
    		grayscale: false,
    		sepia: false,
    		vignette: true,
    		eskil: false,
    		scanlines: true,
    		noise: true,
    		noiseIntensity: 1.0,
    		scanlineIntensity: 0.6,
    		scanlineDensity: 1.0,
    		greyscaleIntensity: 1.0,
    		sepiaIntensity: 1.0,
    		vignetteOffset: 0.0,
    		vignetteDarkness: 0.15,
    	});
      composer.addPass(filmPass);
      var bloomPass = new BloomPass({
        resolutionScale: 0.5,
        blurriness: 0.8,
        strength: 1.25,
        distinction: 2.0
      });
      composer.addPass(bloomPass);
      var bokehPass = new BokehPass(renderPass.depthTexture, {
        focus: 1.0,
        aperture: 0.01,
        maxBlur: 0.025
      });
      composer.addPass(bokehPass);

      bokehPass.renderToScreen = true;
    } else if (terrainName === 'xainza') {

      composer.addPass(renderPass);

      var filmPass = new FilmPass({
    		grayscale: false,
    		sepia: false,
    		vignette: true,
    		eskil: false,
    		scanlines: true,
    		noise: true,
    		noiseIntensity: 0.5,
    		scanlineIntensity: 1.5,
    		scanlineDensity: 0.4,
    		greyscaleIntensity: 1.0,
    		sepiaIntensity: 1.0,
    		vignetteOffset: 0.0,
    		vignetteDarkness: 0.65,
    	});
      composer.addPass(filmPass);

      var bloomPass = new BloomPass({
        resolutionScale: 0.5,
        blurriness: 0.8,
        strength: 2.5,
        distinction: 1.0
      });
      composer.addPass(bloomPass);
      var bokehPass = new BokehPass(renderPass.depthTexture, {
		    focus: 1.0,
		    aperture: 0.01,
		    maxBlur: 0.025
	    });
      composer.addPass(bokehPass);

      bokehPass.renderToScreen = true;

    } else if (terrainName === 'sand_lines') {

      console.log(composer)
      composer.addPass(renderPass);
      var filmPass = new FilmPass({
    		grayscale: false,
    		sepia: false,
    		vignette: true,
    		eskil: false,
    		scanlines: true,
    		noise: true,
    		noiseIntensity: 1.0,
    		scanlineIntensity: .6,
    		scanlineDensity: 1.0,
    		greyscaleIntensity: 1.0,
    		sepiaIntensity: 1.0,
    		vignetteOffset: 0.0,
    		vignetteDarkness: 0.25,
    	});
      composer.addPass(filmPass);
      var bloomPass = new BloomPass({
        resolutionScale: 0.5,
        blurriness: 0.8,
        strength: 1.25,
        distinction: 0.1
      });
      composer.addPass(bloomPass);
      var bokehPass = new BokehPass(renderPass.depthTexture, {
        focus: 1.0,
        aperture: 0.009,
        maxBlur: 0.025
      });
      composer.addPass(bokehPass);

      bokehPass.renderToScreen = true;
    }
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

    // camera.position.z = 150 + (Math.sin(time/5)*50);
    // texturePlane.mesh.rotation.x = (23.5/180)*Math.PI;
    // texturePlane.mesh.rotation.z += 0.005;
    // texturePlane2.mesh.rotation.z += -0.005;
    // texturePlane.mesh.rotation.z += -0.00025;

    // texturePlane.material.uniforms.mouse.value = new THREE.Vector2(window.innerWidth/2, window.innerHeight/2);
    // texturePlane.material.uniforms.mouse.value = new THREE.Vector2(unMappedMouseX, unMappedMouseY);
    // texturePlane.material.uniforms.time.value = time;
    if (terrainName === 'polar_dunes'){
      texturePlane.material.displacementScale = 125 + Math.abs((Math.sin(time/1.5)*30))
    }  else if (terrainName === 'xainza') {

      // texturePlane.mesh.rotation.x = (2.5/180)*Math.PI;
      // texturePlane.mesh.rotation.z = (23.5/180)*Math.PI * (Math.sin(Date.now())* 0.001);
      // camera.lookAt(texturePlane.mesh.position);
      // texturePlane.mesh.rotation.z = Date.now() * 0.0001;
      // texturePlane.mesh.rotation.x = Date.now() * 0.0001;
      // texturePlane.mesh.rotation.y = Date.now() * 0.0001;
      // camera.position.z = 10000 + (Math.sin(time/100)*18500);
      // texturePlane.mesh.scale.x += Math.sin(time/10)*0.01;
      // texturePlane.mesh.scale.y += Math.sin(time/10)*0.01;
      // texturePlane.mesh.scale.z += Math.sin(time/10)*0.01;
      // texturePlane.mesh.scale.z += Math.sin(time) *0.001;
      texturePlane.material.displacementScale = 125 + Math.abs(Math.sin(time/5.5)*30)

    } else {
      texturePlane.material.displacementScale = -570 + Math.sin(time/1.5)*700

    }
    composer.render();

    // renderer.render(scene, camera);
  }

  function setTerrain(tex, scene, camera){
    if (currentSound) {
      console.log(currentSound);
      currentSound.stop();
    }
    currentSound = new Howl({
      urls: [tex.sound],
      loop: true,
      volume: 0.5
    });
    currentSound.play();
    if (texturePlane) {
      scene.remove(texturePlane.mesh);
    }
    assign(document.getElementById('container').style, {
      'background': 'url("'+tex.bg+'")',
      'background-size': '1024px 576px',

      'background-repeat':'no-repeat',
    })


    camera.position.x = tex.camera.position.x;
    camera.position.y = tex.camera.position.y;
    camera.position.z = tex.camera.position.z;

    camera.rotation.x = tex.camera.rotation.x;
    camera.rotation.y = tex.camera.rotation.y;
    camera.rotation.z = tex.camera.rotation.z;


    // controls.reset();
    // let ambientLight = new THREE.AmbientLight( 0xffffff );
    // scene.add( ambientLight );
    texturePlane = new TexturePlane(scene, camera, renderer, tex, null);
    // texturePlane2 = new TexturePlane(scene, camera, renderer, tex, null);
    // texturePlane3 = new TexturePlane(scene, camera, renderer, tex, null);
    // texturePlane4 = new TexturePlane(scene, camera, renderer, tex, null);

    // camera.lookAt(new THREE.Vector3(0,0,0))
    // texturePlane.setRotation(new THREE.Vector3(0,0,6.959999999999984))
    texturePlane.setRotation(new THREE.Vector3(tex.mesh.rotation.x,tex.mesh.rotation.y,tex.mesh.rotation.z))
    // var testA = new THREE.Vector3(texturePlane.mesh.rotation.x,texturePlane.mesh.rotation.y,texturePlane.mesh.rotation.z);
    texturePlane.setPosition(new THREE.Vector3(tex.mesh.position.x,tex.mesh.position.y,tex.mesh.position.z))
    // console.log(texturePlane.mesh.rotation.x,texturePlane.mesh.rotation.y,texturePlane.mesh.rotation.z);
    // texturePlane.setPosition(new THREE.Vector3(texturePlane.mesh.position.x,texturePlane.mesh.position.y,texturePlane.mesh.position.z))
    // texturePlane2.setRotation(new THREE.Vector3(2.0,0,0))
    // texturePlane2.setPosition(new THREE.Vector3(0,0,250.0))
    // texturePlane3.setPosition(new THREE.Vector3(0,0,0))
    // texturePlane3.setRotation(new THREE.Vector3(2.0,0,0))
    // texturePlane4.setPosition(new THREE.Vector3(0,0,0))
    // texturePlane4.setRotation(new THREE.Vector3(2.0,0,0))
    // var cameraHelper = new THREE.CameraHelper(camera);
    // scene.add(cameraHelper);

    // var lightHelper = new THREE.DirectionalLightHelper(directionalLight,50);
    // scene.add( lightHelper );
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
