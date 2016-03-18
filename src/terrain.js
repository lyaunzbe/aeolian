export default function() {
  return [{
    'polar_dunes' : {
      sound: './assets/a1.mp3',
      bg: './assets/a2.gif',
      color: './assets/mars/polar_dunes/color.jpg',
      specular: './assets/mars/polar_dunes/specular.jpg',
      normal: './assets/mars/polar_dunes/normal.jpg',
      bump: './assets/mars/polar_dunes/specular.jpg',
      displacement: './assets/mars/polar_dunes/specular.jpg',
      camera: {
        position : {
          x : -405.10683071580667,
          y : -359.236585685883,
          z :  355.3652831633366,
        },
        rotation : {
          x : 1.3641277891806587,
          y : 0.015744772253039444,
          z : -0.07495216294397486,
        }
      },
      mesh : {
        position : {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        rotation: {
          x: 0.0,
          y: 0.0,
          z: 6.959999999999984
        },
        props : {
          color: 0x878463,
          specular: 0xD29647,
          shininess: 25,
          bumpScale: 10,
          displacementScale: 120,
        }
      }
    }},
    {
      'xainza' : {
      bg: './assets/a1.gif',
      sound: './assets/a2.mp3',
      color: './assets/mars/xainza/color.jpg',
      specular: './assets/mars/xainza/specular.jpg',
      normal: './assets/mars/xainza/normal.jpg',
      bump: './assets/mars/xainza/bump.jpg',
      displacement: './assets/mars/xainza/specular.jpg',
      geomType: 'torus',
      camera: {
        position : {
          x : -61.17845726174966,
          y : 475.9977335811319,
          z :   479.9995913770947,
        },
        rotation : {
          x : -1.3347850582384488,
          y : -0.015688232127307185,
          z : -0.06513861969063502
        }
      },
      mesh : {
        position : {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        rotation: {
          x: 0.0,
          y: 0,
          z: -5.639999999999988
        },
        props : {
          color: 0x878463,
          specular: 0xD29647,
          shininess: 25,
          bumpScale: 100,
          displacementScale: 100,
        }
      }
    }},
    {
      'sand_lines' : {
      bg: './assets/a3.gif',
      sound: './assets/a3.mp3',
      color: './assets/mars/sand_lines/color.jpg',
      specular: './assets/mars/sand_lines/specular.jpg',
      normal: './assets/mars/sand_lines/normal.jpg',
      bump: './assets/mars/sand_lines/bump.jpg',
      displacement: './assets/sand_lines/xainza/specular.jpg',
      geomType: 'iso',
      camera: {
        position : {
          x : 125.99690625329706,
          y : -642.4083833324235,
          z :  -108.02764257748369,
        },
        rotation : {
          x : 1.5813927315523804,
          y : 0.002594116259404832,
          z : -2.9015128881918026,
        }
      },
      mesh : {
        position : {
          x: 0.0,
          y: 0.0,
          z: 0.0
        },
        rotation: {
          x: 0.0,
          y: 0,
          z: 0.5600000000000003
        },
        props : {
          color: 0x878463,
          specular: 0xD29647,
          shininess: 25,
          bumpScale: 0,
          displacementScale:-500,
        }
      }
    }}];
}
