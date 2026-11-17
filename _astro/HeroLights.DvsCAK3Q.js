import{j as ve}from"./jsx-runtime.D_zvdyIk.js";import{r as _}from"./index.DLkBFFtG.js";/* empty css                       */const kt={circle:0,square:1,ring:2,sparkle:3},Dt={parallax:0,repel:1,attract:2},Ot={none:0,up:1,down:2,forward:3},zt=2e4,et=900,tt=9e3,ae=4,pe=10,xe=1/Math.tan(7.5*Math.PI/180),rt=.1,$=100,It=1.8,Pe=1.5,it=520,st=46,Vt=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec3 aPosition;
layout(location = 2) in vec4 aRandom;
layout(location = 3) in vec3 aColor;
uniform mat3 uRotation;
uniform vec3 uOffset;
uniform float uSpread;
uniform float uTime;
uniform float uCamera;
uniform float uAspect;
uniform vec2 uView;
uniform float uRatio;
uniform float uSize;
uniform float uRandomness;
uniform float uBlur;
uniform float uFocus;
uniform float uGlow;
uniform float uTwinkle;
uniform int uShape;
uniform int uDrift;
uniform float uTravel;
uniform vec4 uPointer;
uniform int uEffect;
uniform float uStrength;
uniform vec4 uBursts[${ae}];
uniform int uBurstCount;
uniform float uReveal;
out vec2 vLocal;
out float vRadius;
out float vBlur;
out float vAlpha;
out float vHalo;
out float vSeed;
out vec3 vColor;

vec3 bob(vec4 r, float t) {
  return vec3(
    sin(t * r.z + 6.28 * r.w) * mix(0.1, 1.5, r.x),
    sin(t * r.y + 6.28 * r.x) * mix(0.1, 1.5, r.w),
    sin(t * r.w + 6.28 * r.y) * mix(0.1, 1.5, r.z)
  );
}

void main() {
  vec3 pos = aPosition * uSpread;
  pos.z *= ${pe.toFixed(1)};
  vec3 wobble = bob(aRandom, uTime);
  vec3 world = uRotation * pos + uOffset + wobble;
  float edge = 1.0;
  if (uDrift == 1 || uDrift == 2) {
    float span = uSpread * 2.0 + 3.0;
    float k = mod(aRandom.w * span + uOffset.y + wobble.y + (uDrift == 1 ? uTravel : -uTravel), span);
    world.y = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.12, k) * smoothstep(span, span * 0.88, k);
  } else if (uDrift == 3) {
    float span = uSpread * ${pe.toFixed(1)} * 2.0 + 3.0;
    float k = mod(aRandom.y * span + uOffset.z + wobble.z + uTravel, span);
    world.z = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.1, k);
  }
  vec3 view = world - vec3(0.0, 0.0, uCamera);
  float dist = length(view);
  float ahead = -view.z;
  if (ahead < ${rt.toFixed(2)} || ahead > ${$.toFixed(1)}) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  edge *= smoothstep(1.0, 4.0, ahead);
  vec2 ndc = vec2(view.x * ${xe.toFixed(6)} / uAspect, view.y * ${xe.toFixed(6)}) / ahead;
  vec2 screen = (ndc * 0.5 + 0.5) * uView;

  vec2 shift = vec2(0.0);
  float flash = 0.0;
  if (uEffect != 0 && uPointer.z > 0.001) {
    vec2 delta = screen - uPointer.xy;
    float reach = length(delta);
    float falloff = exp(-dot(delta, delta) / (uPointer.w * uPointer.w));
    vec2 away = reach > 0.001 ? delta / reach : vec2(0.0);
    shift += (uEffect == 1 ? away * uPointer.w * 0.5 : -delta * 0.6) * falloff * uStrength * uPointer.z;
  }
  for (int i = 0; i < ${ae}; i++) {
    if (i >= uBurstCount) break;
    vec4 burst = uBursts[i];
    vec2 delta = screen - burst.xy;
    float reach = length(delta);
    float wave = exp(-pow((reach - burst.z * ${it.toFixed(1)}) / ${st.toFixed(1)}, 2.0));
    vec2 away = reach > 0.001 ? delta / reach : vec2(0.0);
    float fade = (1.0 - burst.z) * (1.0 - burst.z) * burst.w;
    shift += away * wave * fade * 56.0 * smoothstep(0.0, 30.0, reach);
    flash += wave * fade;
  }
  screen += shift;

  float diameter = (uRandomness <= 0.0 ? uSize : uSize * (1.0 + uRandomness * (aRandom.x - 0.5)) / dist) * (1.0 + min(flash, 1.0) * 0.6);
  float device = diameter * uRatio;
  float radius = max(diameter, 1.0 / uRatio) * 0.5;
  float coverage = min(1.0, device * device);
  float blur = uBlur * max(uFocus - dist, 0.0) / max(dist, 1.0);
  float halo = uGlow > 0.0 ? radius * 2.5 + 2.0 : 0.0;
  float extent = radius * (uShape == 3 ? 1.6 : 1.0) + blur + halo + 1.5;

  float twinkle = 1.0 - uTwinkle * 0.6 * (0.5 + 0.5 * sin(uTime * (6.0 + aRandom.y * 14.0) + aRandom.w * 40.0));
  float far = smoothstep(${$.toFixed(1)}, ${($*.9).toFixed(1)}, ahead);
  float focus = radius / (radius + blur);
  float reveal = clamp(uReveal * 1.6 - aRandom.z * 0.6, 0.0, 1.0);

  vLocal = aCorner * extent;
  vRadius = radius;
  vBlur = blur;
  vHalo = halo;
  vSeed = aRandom.y;
  vAlpha = min(1.0, coverage * twinkle * (1.0 + flash * 1.4)) * far * edge * max(focus, 0.35) * reveal * reveal;
  vColor = aColor;
  gl_Position = vec4((screen + aCorner * extent) / uView * 2.0 - 1.0, 0.0, 1.0);
}`,Ut=`#version 300 es
precision highp float;
precision highp int;
uniform int uShape;
uniform float uGlow;
uniform float uRatio;
uniform float uTime;
uniform float uSoft;
uniform float uShimmer;
uniform float uOpacity;
in vec2 vLocal;
in float vRadius;
in float vBlur;
in float vAlpha;
in float vHalo;
in float vSeed;
in vec3 vColor;
out vec4 outColor;

float ray(vec2 q, float aa) {
  float width = 0.14 * max(0.0, 1.0 - q.x);
  return (1.0 - smoothstep(width - aa, width + aa, q.y)) * step(q.x, 1.0);
}

void main() {
  float soft = vBlur + 0.7 / uRatio + vRadius * uSoft;
  float d = length(vLocal);
  float shape;
  if (uShape == 1) {
    float box = max(abs(vLocal.x), abs(vLocal.y));
    shape = 1.0 - smoothstep(vRadius * 0.86 - soft, vRadius * 0.86 + soft, box);
  } else if (uShape == 2) {
    float edge = max(vRadius * 0.22, 0.6 / uRatio);
    shape = 1.0 - smoothstep(edge - soft, edge + soft, abs(d - vRadius * 0.8));
  } else if (uShape == 3) {
    float reach = vRadius * 1.6;
    vec2 q = abs(vLocal) / max(reach, 0.0001);
    float aa = soft / max(reach, 0.0001);
    shape = max(max(ray(q, aa), ray(q.yx, aa)), 1.0 - smoothstep(vRadius * 0.32 - soft, vRadius * 0.32 + soft, d));
  } else {
    shape = 1.0 - smoothstep(vRadius - soft, vRadius + soft, d);
  }
  float halo = vHalo > 0.0 ? exp(-d / (vHalo * 0.35)) * uGlow * 0.4 : 0.0;
  float alpha = clamp(shape + halo * (1.0 - shape), 0.0, 1.0) * vAlpha * uOpacity * (1.0 - uSoft);
  if (alpha < 0.002) discard;
  vec2 uv = vLocal / max(vRadius * 2.0, 0.0001) + 0.5;
  vec3 color = clamp(vColor + uShimmer * 0.2 * sin(uv.yxx + uTime + vSeed * 6.28), 0.0, 1.0);
  outColor = vec4(color * alpha, alpha);
}`,Nt=`#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aEnds;
layout(location = 2) in vec4 aTint;
uniform vec2 uView;
uniform float uRatio;
uniform float uWidth;
out float vAcross;
out float vHalf;
out vec4 vTint;

void main() {
  vec2 a = aEnds.xy;
  vec2 b = aEnds.zw;
  vec2 along = b - a;
  float span = max(length(along), 0.0001);
  vec2 normal = vec2(-along.y, along.x) / span;
  float reach = uWidth * 0.5 + 1.0 / uRatio;
  vec2 point = mix(a, b, aCorner.x * 0.5 + 0.5) + normal * aCorner.y * reach;
  vAcross = aCorner.y * reach;
  vHalf = uWidth * 0.5;
  vTint = aTint;
  gl_Position = vec4(point / uView * 2.0 - 1.0, 0.0, 1.0);
}`,Yt=`#version 300 es
precision highp float;
uniform float uRatio;
uniform float uOpacity;
in float vAcross;
in float vHalf;
in vec4 vTint;
out vec4 outColor;

void main() {
  float edge = 0.6 / uRatio;
  float cover = 1.0 - smoothstep(vHalf - edge, vHalf + edge, abs(vAcross));
  float alpha = cover * vTint.a * uOpacity;
  outColor = vec4(vTint.rgb * alpha, alpha);
}`,T=(r,y,x)=>Math.min(x,Math.max(y,r)),ot=(r,y,x)=>{const g=r.createShader(y);return g?(r.shaderSource(g,x),r.compileShader(g),r.getShaderParameter(g,r.COMPILE_STATUS)?g:(r.deleteShader(g),null)):null},at=(r,y,x)=>{const g=ot(r,r.VERTEX_SHADER,y),O=ot(r,r.FRAGMENT_SHADER,x),F=r.createProgram();if(!g||!O||!F)return null;if(r.attachShader(F,g),r.attachShader(F,O),r.linkProgram(F),r.deleteShader(g),r.deleteShader(O),!r.getProgramParameter(F,r.LINK_STATUS))return r.deleteProgram(F),null;const W={},X=r.getProgramParameter(F,r.ACTIVE_UNIFORMS);for(let z=0;z<X;z++){const V=r.getActiveUniform(F,z);V&&(W[V.name.replace("[0]","")]=r.getUniformLocation(F,V.name))}return{program:F,uniforms:W}},Ht=r=>{let y=r>>>0;return()=>{y=y+1831565813>>>0;let x=y;return x=Math.imul(x^x>>>15,x|1),x^=x+Math.imul(x^x>>>7,x|61),((x^x>>>14)>>>0)/4294967296}},$t=r=>1-Math.pow(1-T(r,0,1),3),nt=(r,y)=>(r%y+y)%y,Wt=({particleCount:r=200,particleSpread:y=10,speed:x=.1,particleColors:g=["#ffffff"],moveParticlesOnHover:O=!0,particleHoverFactor:F=1,alphaParticles:W=!1,particleBaseSize:X=100,sizeRandomness:z=1,cameraDistance:V=20,disableRotation:ct=!1,pixelRatio:ft,shape:lt="circle",glow:ut=.5,twinkle:dt=.3,depthOfField:ht=0,connections:mt=!1,connectionDistance:vt=110,hoverEffect:pt="parallax",hoverRadius:xt=140,clickBurst:wt=!0,drift:Rt="none",driftSpeed:yt=1,variation:At=0,intro:bt=!0,opacity:gt=1,lightMode:Et=!1,paused:Ft=!1,className:Ce="",style:Mt})=>{const _e=_.useRef(null),Le=_.useRef(null),we=_.useRef(null),ke=(Array.isArray(g)?g:[g]).filter(Boolean).map(String),De={count:T(Math.round(r),1,zt),spread:Math.max(.1,y),speed:x,colors:ke.length?ke:["#ffffff"],mouse:O,hoverFactor:Math.max(0,F),soft:W,size:Math.max(0,X),randomness:Math.max(0,z),camera:Math.max(1,V),rotate:!ct,dpr:ft,shape:kt[lt]??0,glow:Math.max(0,ut),twinkle:T(dt,0,1),depthOfField:Math.max(0,ht),connections:mt,connectionDistance:Math.max(10,vt),hoverEffect:Dt[pt]??0,hoverRadius:Math.max(20,xt),clickBurst:wt,drift:Ot[Rt]??0,driftSpeed:yt,variation:Math.max(0,Math.round(At)),intro:bt,opacity:T(gt,0,1),lightMode:Et,paused:Ft},D=_.useRef(De);return D.current=De,_.useEffect(()=>{const q=_e.current,I=Le.current,e=I?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!q||!I||!e)return;const ne=at(e,Vt,Ut),U=at(e,Nt,Yt);if(!ne||!U)return;const re=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,re),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const Re=e.createBuffer(),ye=e.createBuffer(),Ae=e.createBuffer(),be=e.createVertexArray();e.bindVertexArray(be),e.bindBuffer(e.ARRAY_BUFFER,re),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const ge=(t,o,n)=>{e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,n,e.FLOAT,!1,0,0),e.vertexAttribDivisor(o,1)};ge(Re,1,3),ge(ye,2,4),ge(Ae,3,3);const Ee=e.createBuffer(),L=new Float32Array(tt*8),Fe=e.createVertexArray();e.bindVertexArray(Fe),e.bindBuffer(e.ARRAY_BUFFER,re),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,Ee),e.bufferData(e.ARRAY_BUFFER,L.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(2,1),e.bindVertexArray(null);const G=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),ee=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,Oe=new Map,ze=t=>{const o=Oe.get(t);if(o)return o;let n=[1,1,1];if(G){G.clearRect(0,0,1,1),G.fillStyle="#ffffff",G.fillStyle=t,G.fillRect(0,0,1,1);const[i,f,a]=G.getImageData(0,0,1,1).data;n=[i/255,f/255,a/255]}return Oe.set(t,n),n},St=t=>{const o=t.map(f=>Math.pow(f,2.2)),n=.2126*o[0]+.7152*o[1]+.0722*o[2],i=Math.min(1,.06/Math.max(n,1e-4));return o.map(f=>Math.pow(f*i,1/2.2))},R={width:1,height:1,ratio:1},s={x:0,y:0,sx:0,sy:0,nx:0,ny:0,inside:!1,active:0},u={clock:0,spin:0,travel:0,offsetX:0,offsetY:0,reveal:D.current.intro&&!ee?0:1},B=[],Ie=new Float32Array(ae*4),w={key:"",count:0,positions:new Float32Array(0),randoms:new Float32Array(0),colors:new Float32Array(0)},d={x:new Float32Array(0),y:new Float32Array(0),ahead:new Float32Array(0),alpha:new Float32Array(0)};let j=0,K=0,ie=!0;const Tt=t=>{const o=`${t.count}|${t.variation}|${t.colors.join(",")}|${t.lightMode?1:0}`;if(o===w.key)return;w.key=o;const n=Ht(t.variation*7919+1),i=t.count,f=new Float32Array(i*3),a=new Float32Array(i*4),h=new Float32Array(i*3),l=t.colors.map(m=>t.lightMode?St(ze(m)):ze(m));for(let m=0;m<i;m++){let v,M,p,A;do v=n()*2-1,M=n()*2-1,p=n()*2-1,A=v*v+M*M+p*p;while(A>1||A===0);const P=Math.cbrt(n());f.set([v*P,M*P,p*P],m*3),a.set([n(),n(),n(),n()],m*4),h.set(l[Math.floor(n()*l.length)],m*3)}w.count=i,w.positions=f,w.randoms=a,w.colors=h;const c=Math.min(i,et);d.x=new Float32Array(c),d.y=new Float32Array(c),d.ahead=new Float32Array(c),d.alpha=new Float32Array(c),e.bindBuffer(e.ARRAY_BUFFER,Re),e.bufferData(e.ARRAY_BUFFER,f,e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,ye),e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,Ae),e.bufferData(e.ARRAY_BUFFER,h,e.STATIC_DRAW)},Bt=t=>{const o=u.clock*1e3,n=t.rotate?Math.sin(o*2e-4)*.1:0,i=t.rotate?Math.cos(o*5e-4)*.15:0,f=t.rotate?u.spin:0,[a,h,l,c,m,v]=[Math.sin(n),Math.cos(n),Math.sin(i),Math.cos(i),Math.sin(f),Math.cos(f)];return[c*v+l*a*m,h*m,-l*v+c*a*m,-c*m+l*a*v,h*v,l*m+c*a*v,l*h,-a,c*h]},Ve=()=>[u.offsetX,u.offsetY,-(1-$t(u.reveal))*70],Pt=(t,o)=>{const n=Math.min(w.count,et),[i,f,a]=Ve(),h=R.width/R.height,l=u.clock,c=t.hoverRadius,m=t.hoverEffect!==0?s.active:0,v=t.spread*2+3,M=t.spread*pe*2+3;for(let p=0;p<n;p++){const A=w.positions[p*3]*t.spread,P=w.positions[p*3+1]*t.spread,S=w.positions[p*3+2]*t.spread*pe,te=w.randoms[p*4],J=w.randoms[p*4+1],Q=w.randoms[p*4+2],N=w.randoms[p*4+3],fe=Math.sin(l*Q+6.28*N)*(.1+1.4*te),C=Math.sin(l*J+6.28*te)*(.1+1.4*N),je=Math.sin(l*N+6.28*J)*(.1+1.4*Q),_t=o[0]*A+o[3]*P+o[6]*S+i+fe;let Ke=o[1]*A+o[4]*P+o[7]*S+f+C,Ze=o[2]*A+o[5]*P+o[8]*S+a+je,le=1;if(t.drift===1||t.drift===2){const E=nt(N*v+f+C+(t.drift===1?u.travel:-u.travel),v);Ke=E-v/2;const b=T(E/(v*.12),0,1),k=T((v-E)/(v*.12),0,1);le=b*b*(3-2*b)*k*k*(3-2*k)}else if(t.drift===3){const E=nt(J*M+a+je+u.travel,M);Ze=E-M/2;const b=T(E/(M*.1),0,1);le=b*b*(3-2*b)}const Y=t.camera-Ze;if(Y<rt||Y>$){d.alpha[p]=0;continue}const Se=T((Y-1)/3,0,1);le*=Se*Se*(3-2*Se);let ue=_t*xe/h/Y*.5*R.width+R.width/2,de=Ke*xe/Y*.5*R.height+R.height/2,he=0,me=0;if(m>.001){const E=ue-s.sx,b=de-s.sy,k=Math.hypot(E,b),H=Math.exp(-(E*E+b*b)/(c*c))*t.hoverFactor*m;t.hoverEffect===1&&k>.001?(he+=E/k*c*.5*H,me+=b/k*c*.5*H):t.hoverEffect===2&&(he-=E*.6*H,me-=b*.6*H)}for(const E of B){const b=E.age/Pe,k=ue-E.x,H=de-E.y,oe=Math.hypot(k,H);if(oe<.001)continue;const Lt=Math.exp(-Math.pow((oe-b*it)/st,2)),Be=T(oe/30,0,1),Qe=Lt*(1-b)*(1-b)*56*Be*Be*(3-2*Be);he+=k/oe*Qe,me+=H/oe*Qe}ue+=he,de+=me;const Te=T(($-Y)/($-$*.9),0,1),Je=T(u.reveal*1.6-Q*.6,0,1);d.x[p]=ue,d.y[p]=de,d.ahead[p]=Y,d.alpha[p]=Te*Te*(3-2*Te)*le*Je*Je}return n},Ct=(t,o)=>{const n=Pt(t,o),i=t.connectionDistance,f=Math.max(1,Math.ceil(R.width/i)+2),a=new Map;for(let c=0;c<n;c++){if(d.alpha[c]<.02)continue;const m=(Math.floor(d.y[c]/i)+1)*f+Math.floor(d.x[c]/i)+1,v=a.get(m);v?v.push(c):a.set(m,[c])}let h=0;const l=i*i;for(const[c,m]of a)for(const v of[0,1,f-1,f,f+1]){const M=v===0?m:a.get(c+v);if(M)for(let p=0;p<m.length;p++){const A=m[p];for(let P=v===0?p+1:0;P<M.length;P++){const S=M[P],te=d.x[A]-d.x[S],J=d.y[A]-d.y[S],Q=te*te+J*J;if(Q>l)continue;const N=T(1-Math.abs(d.ahead[A]-d.ahead[S])/18,0,1);if(N<=0)continue;if(h>=tt)return h;const fe=1-Math.sqrt(Q)/i,C=h*8;L[C]=d.x[A],L[C+1]=d.y[A],L[C+2]=d.x[S],L[C+3]=d.y[S],L[C+4]=(w.colors[A*3]+w.colors[S*3])/2,L[C+5]=(w.colors[A*3+1]+w.colors[S*3+1])/2,L[C+6]=(w.colors[A*3+2]+w.colors[S*3+2])/2,L[C+7]=fe*fe*N*.7*Math.min(d.alpha[A],d.alpha[S]),h++}}}return h},se=()=>{const t=D.current;Tt(t);const o=Bt(t),[n,i,f]=Ve();if(e.viewport(0,0,I.width,I.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),t.connections){const l=Ct(t,o);l&&(e.useProgram(U.program),e.bindVertexArray(Fe),e.bindBuffer(e.ARRAY_BUFFER,Ee),e.bufferSubData(e.ARRAY_BUFFER,0,L.subarray(0,l*8)),e.uniform2f(U.uniforms.uView,R.width,R.height),e.uniform1f(U.uniforms.uRatio,R.ratio),e.uniform1f(U.uniforms.uWidth,1),e.uniform1f(U.uniforms.uOpacity,t.opacity),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,l))}const a=ne.uniforms;let h=0;for(let l=B.length-1;l>=0&&h<ae;l--)Ie.set([B[l].x,B[l].y,B[l].age/Pe,1],h*4),h++;e.useProgram(ne.program),e.bindVertexArray(be),e.uniformMatrix3fv(a.uRotation,!1,o),e.uniform3f(a.uOffset,n,i,f),e.uniform1f(a.uSpread,t.spread),e.uniform1f(a.uTime,u.clock),e.uniform1f(a.uCamera,t.camera),e.uniform1f(a.uAspect,R.width/R.height),e.uniform2f(a.uView,R.width,R.height),e.uniform1f(a.uRatio,R.ratio),e.uniform1f(a.uSize,t.size),e.uniform1f(a.uRandomness,t.randomness),e.uniform1f(a.uBlur,t.depthOfField*14),e.uniform1f(a.uFocus,t.camera+14),e.uniform1f(a.uGlow,t.lightMode?t.glow*.3:t.glow),e.uniform1f(a.uTwinkle,t.twinkle),e.uniform1i(a.uShape,t.shape),e.uniform1i(a.uDrift,t.drift),e.uniform1f(a.uTravel,u.travel),e.uniform4f(a.uPointer,s.sx,s.sy,s.active,t.hoverRadius),e.uniform1i(a.uEffect,t.hoverEffect),e.uniform1f(a.uStrength,t.hoverFactor),e.uniform4fv(a.uBursts,Ie),e.uniform1i(a.uBurstCount,h),e.uniform1f(a.uReveal,u.reveal),e.uniform1f(a.uSoft,t.soft?.2:0),e.uniform1f(a.uShimmer,t.lightMode?0:1),e.uniform1f(a.uOpacity,t.opacity),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,w.count),e.bindVertexArray(null)},Ue=t=>{if(j=0,!ie||document.hidden)return;const o=D.current,n=K?T((t-K)/1e3,5e-4,.05):1/60;if(K=t,o.paused){u.reveal=1,se(),K=0;return}const i=ee?0:1,f=n*o.speed*i;u.clock+=f,o.rotate&&(u.spin+=f*.6),u.travel+=n*o.driftSpeed*i*(o.drift===3?6:.9);const a=o.mouse&&s.inside&&!ee,h=1-Math.exp(-n/.35),l=a&&o.hoverEffect===0?o.hoverFactor:0;u.offsetX+=(-s.nx*l-u.offsetX)*h,u.offsetY+=(-s.ny*l-u.offsetY)*h,s.sx+=(s.x-s.sx)*(1-Math.exp(-n/.06)),s.sy+=(s.y-s.sy)*(1-Math.exp(-n/.06)),s.active+=((a?1:0)-s.active)*(1-Math.exp(-n/.2));for(let c=B.length-1;c>=0;c--)B[c].age+=n,B[c].age>=Pe&&B.splice(c,1);!o.intro||ee?u.reveal=1:u.reveal<1&&(u.reveal=Math.min(1,u.reveal+n/It)),se(),j=requestAnimationFrame(Ue)},Z=()=>{!j&&ie&&!document.hidden&&(j=requestAnimationFrame(Ue))},Me=()=>{const t=D.current,o=Math.max(1,q.clientWidth),n=Math.max(1,q.clientHeight),i=Math.min(t.dpr||window.devicePixelRatio||1,2);R.width=o,R.height=n,I.width=Math.max(1,Math.round(o*i)),I.height=Math.max(1,Math.round(n*i)),R.ratio=I.width/o,se(),Z()},Ne=t=>{const o=q.getBoundingClientRect(),n=t.clientX-o.left,i=t.clientY-o.top,f=s.inside;s.inside=n>=0&&i>=0&&n<=o.width&&i<=o.height,s.x=n,s.y=o.height-i,s.nx=n/Math.max(1,o.width)*2-1,s.ny=-(i/Math.max(1,o.height)*2-1),s.inside&&!f&&(s.sx=s.x,s.sy=s.y)},Ye=t=>{Ne(t),D.current.paused||Z()},He=t=>{const o=D.current;Ne(t),!(!s.inside||!o.clickBurst||o.paused||ee)&&(B.push({x:s.x,y:s.y,age:0}),B.length>ae&&B.shift(),Z())},ce=t=>{t.pointerType!=="mouse"&&(s.inside=!1)},$e=()=>{s.inside=!1},We=()=>{K=0,Z()},Xe=new ResizeObserver(Me);Xe.observe(q);const qe=new IntersectionObserver(t=>{ie=t.some(o=>o.isIntersecting),ie&&(K=0,Z())});qe.observe(q),window.addEventListener("pointermove",Ye,{passive:!0}),window.addEventListener("pointerdown",He,{passive:!0}),window.addEventListener("pointerup",ce,{passive:!0}),window.addEventListener("pointercancel",ce,{passive:!0}),document.documentElement.addEventListener("pointerleave",$e),document.addEventListener("visibilitychange",We),Me();let Ge=D.current.dpr;return we.current=()=>{const t=D.current;if(t.dpr!==Ge){Ge=t.dpr,Me();return}j||se(),Z()},()=>{cancelAnimationFrame(j),we.current=null,Xe.disconnect(),qe.disconnect(),window.removeEventListener("pointermove",Ye),window.removeEventListener("pointerdown",He),window.removeEventListener("pointerup",ce),window.removeEventListener("pointercancel",ce),document.documentElement.removeEventListener("pointerleave",$e),document.removeEventListener("visibilitychange",We),e.deleteProgram(ne.program),e.deleteProgram(U.program),[re,Re,ye,Ae,Ee].forEach(t=>e.deleteBuffer(t)),e.deleteVertexArray(be),e.deleteVertexArray(Fe),I.isConnected||e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),_.useEffect(()=>{we.current?.()}),ve.jsx("div",{ref:_e,className:`particles-container${Ce?` ${Ce}`:""}`,style:Mt,children:ve.jsx("canvas",{ref:Le,className:"particles-canvas","aria-hidden":"true"})})};function jt(){const r=_.useRef(null),[y,x]=_.useState(!1),[g,O]=_.useState(!1),[F,W]=_.useState(40);return _.useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;W(window.innerWidth<900?40:90),x(!0);const X=new IntersectionObserver(([V])=>O(!V.isIntersecting));r.current&&X.observe(r.current);const z=()=>O(document.hidden);return document.addEventListener("visibilitychange",z),()=>{X.disconnect(),document.removeEventListener("visibilitychange",z)}},[]),ve.jsx("div",{ref:r,className:"hero-lights","aria-hidden":"true",children:y&&ve.jsx(Wt,{particleCount:F,particleSpread:10,speed:.06,particleColors:["#fff1c9","#f2cf83","#ffffff"],alphaParticles:!0,particleBaseSize:F===40?70:90,sizeRandomness:.9,cameraDistance:20,disableRotation:!0,pixelRatio:Math.min(window.devicePixelRatio||1,1.5),twinkle:.8,glow:.6,drift:"up",driftSpeed:.35,moveParticlesOnHover:!1,clickBurst:!1,paused:g})})}export{jt as default};
