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
    if (texture.geomType === 'torus') {
      // this.geometry = new THREE.BufferGeometry().fromGeometry(new THREE.IcosahedronGeometry(2048,5));
      // this.geometry = new THREE.BufferGeometry().fromGeometry(new THREE.TorusGeometry( 250, 50, 30, 200 ));
      this.geometry = new THREE.PlaneBufferGeometry(1024,1024, 500,500);

    } else if (texture.geomType === 'iso') {
      // this.geometry = new THREE.SphereGeometry(2048, 100, 100, 0, 2, 1, 1.2);
      this.geometry = new THREE.PlaneBufferGeometry(1024,1024, 500,500);

    }else {
      this.geometry = new THREE.PlaneBufferGeometry(1024,1024, 500,500);
    }

    // this.geometry = new THREE.BufferGeometry().fromGeometry(new THREE.IcosahedronGeometry(100,5));

		this.material = new THREE.MeshPhongMaterial({
      // uniforms: {
      //   "texture":{ type: "t", value: texture.color },
      //   "texture2":{ type: "t", value: texture.normal },
      //   "time": { type: "f", value: 0.0 },
      //   "resolution"  : { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
      //   "mouse"  : { type: "v2", value: new THREE.Vector2(window.innerWidth/2, window.innerHeight/2)},
      //   "lightWidth"  : { type: "f", value: 2.5 },
			// 	"lightBrightness"  : { type: "f", value: 0.55 }
      // },
      color: texture.mesh.props.color,
			specular: texture.mesh.props.specular,
			shininess: texture.mesh.props.shininess,
			map: texture.color,
			specularMap: texture.specular,
      bumpMap: texture.bump,
      bumpScale: texture.mesh.props.bumpScale,
      displacementMap: texture.specular,
      displacementScale: texture.mesh.props.displacementScale,
			normalMap: texture.normal,
			normalScale: new THREE.Vector2( 0.8, 0.8 ),
      side: THREE.DoubleSide
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
    console.log(rotation)
    this.mesh.rotation.x = rotation.x;
    this.mesh.rotation.y = rotation.y;
    this.mesh.rotation.z = rotation.z;
  }
}
