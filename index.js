import {
  polyfill
}
from 'es6-promise'
polyfill()

import THREE from 'three'
import domready from 'domready'
import viewer from './src/viewer'
import assign from 'object-assign'
import loadVideo from './src/load-video'

domready(() => {

  assign(document.body.style, {
    background: '#000',
    overflow: 'hidden',
    margin: 0,
    'background-image': 'url("assets/cloudy.gif")',
    'background-size': 'cover'
  })
  var textureLoader = new THREE.TextureLoader();

  textureLoader.load( "../assets/mars/polar_dunes/color.jpg" , function(color) {
    textureLoader.load( "../assets/mars/polar_dunes/specular.jpg" , function(specular) {
      textureLoader.load( "../assets/mars/polar_dunes/normal.jpg" , function(normal) {
        console.log('textures loaded')
        let tex = {
          color: color,
          specular: specular,
          normal: normal
        }
        const app = viewer({
          alpha: true,
          preserveDrawingBuffer: false,
          antialias: true
        }, tex);

        document.body.appendChild(app.canvas);
        app.start();
      })
    })
  })



})
