uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
uniform sampler2D tex;


vec2 hash( vec2 p )                       // rand in [-1,1]
{
  p = vec2(dot(p,vec2(127.1,311.7)),
           dot(p,vec2(269.5,183.3)));
  return -1. + 2.*fract(sin(p+20.)*53758.5453123);
}

// 2d noise functions from https://www.shadertoy.com/view/XslGRr
float noise( in vec2 x )
{
  vec2 p = floor(x);
  vec2 f = fract(x);
  f = f*f*(3.0-2.0*f);
  vec2 uv = (p+vec2(37.0,17.0)) + f;
  vec2 rg = hash( uv/256.0 ).yx;
  return 0.5*mix( rg.x, rg.y, 0.5 );
}

//---------------------------------------------------------
#define NB 100      // number or gabor blobs
#define SIZE 0.25   // size of gabor blobs
                    // freq tuned by mouse.x

float rnd(int i, int j)
{
  return noise(vec2(i, j));
}

float DuneStripes (vec2 uv, float d, float freq, float time)
{
  float hv = 0.;
  for (int i=0; i<NB; i++)
  {
    vec2 pos = vec2(rnd(i,0), rnd(i,1));
    vec2 dir = (1.+d)*vec2(rnd(i,2),rnd(i,3)) - d;
    hv += SIZE * sin(dot(uv-pos, freq*dir) * 6. + time);
  }
  return hv;
}



void main()
{

  float frequence = mix(10.0, resolution.x/10.0, 1000.0/resolution.x);
  float h = DuneStripes(vUv, -1.5, frequence, - 2.5*time);
  vec3 duneColor = vec3(0.7,0.6,0.2)*h;


    vec2 p = gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;

    float t = time * 0.3;

    float x = 2.0 * p.x - 1.0;
    float y = 2.0 * p.y - 1.0;
    x *= aspect;

    float r = length(vec2(x,y));
    float a = (atan(x, y) / 3.141592) * 3.0;

    vec2 q;
    q.x = 2.0 * t + 1.0 / r;
    q.y = 1.0 * t  + a;

    vec3 color = texture2D( tex, vUv).rgb;

	  gl_FragColor = vec4(color * 2.0,1.0);
}
