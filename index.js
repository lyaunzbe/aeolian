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
import terrain from './src/terrain'

const textureLoader = new THREE.TextureLoader();

const terrainPack = terrain();

domready(() => {

  assign(document.body.style, {
    background: 'white',
    overflow: 'hidden',
    margin: 0,
  })


  loadTextures().then(function (texPack) {
    console.log(texPack)
    const app = viewer({
      alpha: true,
      preserveDrawingBuffer: false,
      antialias: true
    }, texPack);

    document.getElementById('container').appendChild(app.canvas);
    app.start();
  });





})

function loadTextures(){
  return new Promise((resolve, reject) => {
    var textureLoaderPromises = [];
    terrainPack.forEach(function (terrainObject, index) {
      let terrainName = Object.keys(terrainObject)[0],
          terrain = terrainObject[terrainName];

      let textureLoaderPromise = new Promise((resolveB, reject) => {
        textureLoader.load(terrain.color , function(color) {
          textureLoader.load(terrain.bump , function(bump) {
            textureLoader.load(terrain.specular , function(specular) {
              textureLoader.load(terrain.normal , function(normal) {
                terrainPack[index][terrainName].color = color;
                terrainPack[index][terrainName].bump = bump;
                terrainPack[index][terrainName].specular = specular;
                terrainPack[index][terrainName].normal = normal;

                terrainPack[index][terrainName].color.generateMipmaps = false;
                terrainPack[index][terrainName].bump.generateMipmaps = false;
                terrainPack[index][terrainName].specular.generateMipmaps = false;
                terrainPack[index][terrainName].normal.generateMipmaps = false;

                terrainPack[index][terrainName].color.magFilter = THREE.LinearFilter;
                terrainPack[index][terrainName].color.minFilter = THREE.LinearFilter;
                terrainPack[index][terrainName].bump.magFilter = THREE.LinearFilter;
                terrainPack[index][terrainName].bump.minFilter = THREE.LinearFilter;
                terrainPack[index][terrainName].specular.magFilter = THREE.LinearFilter;
                terrainPack[index][terrainName].specular.minFilter = THREE.LinearFilter;
                terrainPack[index][terrainName].normal.magFilter = THREE.LinearFilter;
                terrainPack[index][terrainName].normal.minFilter = THREE.LinearFilter;

                terrainPack[index][terrainName].name = terrainName;


                return resolveB(terrainPack[index][terrainName]);
              });
            });
          });
        });
      });
      textureLoaderPromises.push(textureLoaderPromise);
    })

    return Promise.all(textureLoaderPromises).then(function (result) {
      return resolve(result);
    })
  })
}
