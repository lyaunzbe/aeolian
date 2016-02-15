import THREE from 'three'
var glslify = require('glslify')


export default class texPlane {
  constructor(scene, camera, renderer, texture, speed) {
    this.scene = scene;
	  this.camera = camera;
	  this.renderer = renderer;
	  this.texture = texture;
	  this.speed = speed;
    // console.log();

    console.log(texture);
    this.geometry = new THREE.PlaneGeometry(1024,1024, 500,500);



		this.material = new THREE.MeshPhongMaterial({
      // uniforms: {
      //   "texture":{ type: "t", value: texture },
      //   "texture2":{ type: "t", value: tex2 },
      //   "time": { type: "f", value: 0.0 },
      //   "resolution"  : { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
      //   "mouse"  : { type: "v2", value: new THREE.Vector2(window.innerWidth/2, window.innerHeight/2)},
      //   "lightWidth"  : { type: "f", value: 2.5 },
			// 	"lightBrightness"  : { type: "f", value: 0.55 }
      // },
      color: 0xF43044,
			specular: 0x00B4AB,
			shininess: 25,
			map: texture.color,
			specularMap: texture.specular,
      bumpMap: texture.specular,
      bumpScale: 10,
      displacementMap: texture.specular,
      displacementScale: 120,
			normalMap: texture.normal,
			normalScale: new THREE.Vector2( 2.8, 2.8 ),
      // side: THREE.DoubleSide,
      // vertexShader: glslify('./shaders/toolbelt/baseDisplace.vert'),
      // fragmentShader: glslify('./shaders/toolbelt/bump.frag')
		})
		this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    console.log('added mesh')
  }

  update(position, rotation) {
    if (position) {
      this.setPosition(new THREE.Vector3(
        this.mesh.position.x + position.x,
        this.mesh.position.y + position.y,
        this.mesh.position.z + position.z ));
    }
    if (rotation) {
      this.setRotation(new THREE.Vector3(
        this.mesh.rotation.x + rotation.x,
        this.mesh.rotation.y + rotation.y,
        this.mesh.rotation.z + rotation.z ));
    }
  }

  setPosition (position) {
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
  }

  setRotation (rotation) {
    this.mesh.rotation.x = rotation.x;
    this.mesh.rotation.y = rotation.y;
    this.mesh.rotation.z = rotation.z;
  }
}
