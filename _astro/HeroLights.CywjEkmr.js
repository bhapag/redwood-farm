import{j as we}from"./jsx-runtime.D_zvdyIk.js";import{r as L}from"./index.DLkBFFtG.js";/* empty css                       */const kt={circle:0,square:1,ring:2,sparkle:3},Dt={parallax:0,repel:1,attract:2},Ot={none:0,up:1,down:2,forward:3},zt=2e4,at=900,nt=9e3,ae=4,xe=10,Re=1/Math.tan(7.5*Math.PI/180),ct=.1,$=100,It=1.8,_e=1.5,ft=520,lt=46,Vt=`#version 300 es
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
  pos.z *= ${xe.toFixed(1)};
  vec3 wobble = bob(aRandom, uTime);
  vec3 world = uRotation * pos + uOffset + wobble;
  float edge = 1.0;
  if (uDrift == 1 || uDrift == 2) {
    float span = uSpread * 2.0 + 3.0;
    float k = mod(aRandom.w * span + uOffset.y + wobble.y + (uDrift == 1 ? uTravel : -uTravel), span);
    world.y = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.12, k) * smoothstep(span, span * 0.88, k);
  } else if (uDrift == 3) {
    float span = uSpread * ${xe.toFixed(1)} * 2.0 + 3.0;
    float k = mod(aRandom.y * span + uOffset.z + wobble.z + uTravel, span);
    world.z = k - span * 0.5;
    edge = smoothstep(0.0, span * 0.1, k);
  }
  vec3 view = world - vec3(0.0, 0.0, uCamera);
  float dist = length(view);
  float ahead = -view.z;
  if (ahead < ${ct.toFixed(2)} || ahead > ${$.toFixed(1)}) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  edge *= smoothstep(1.0, 4.0, ahead);
  vec2 ndc = vec2(view.x * ${Re.toFixed(6)} / uAspect, view.y * ${Re.toFixed(6)}) / ahead;
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
    float wave = exp(-pow((reach - burst.z * ${ft.toFixed(1)}) / ${lt.toFixed(1)}, 2.0));
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
}`,T=(r,y,w)=>Math.min(w,Math.max(y,r)),rt=(r,y,w)=>{const g=r.createShader(y);return g?(r.shaderSource(g,w),r.compileShader(g),r.getShaderParameter(g,r.COMPILE_STATUS)?g:(r.deleteShader(g),null)):null},it=(r,y,w)=>{const g=rt(r,r.VERTEX_SHADER,y),z=rt(r,r.FRAGMENT_SHADER,w),E=r.createProgram();if(!g||!z||!E)return null;if(r.attachShader(E,g),r.attachShader(E,z),r.linkProgram(E),r.deleteShader(g),r.deleteShader(z),!r.getProgramParameter(E,r.LINK_STATUS))return r.deleteProgram(E),null;const W={},Q=r.getProgramParameter(E,r.ACTIVE_UNIFORMS);for(let I=0;I<Q;I++){const D=r.getActiveUniform(E,I);D&&(W[D.name.replace("[0]","")]=r.getUniformLocation(E,D.name))}return{program:E,uniforms:W}},Ht=r=>{let y=r>>>0;return()=>{y=y+1831565813>>>0;let w=y;return w=Math.imul(w^w>>>15,w|1),w^=w+Math.imul(w^w>>>7,w|61),((w^w>>>14)>>>0)/4294967296}},$t=r=>1-Math.pow(1-T(r,0,1),3),st=(r,y)=>(r%y+y)%y,Wt=({particleCount:r=200,particleSpread:y=10,speed:w=.1,particleColors:g=["#ffffff"],moveParticlesOnHover:z=!0,particleHoverFactor:E=1,alphaParticles:W=!1,particleBaseSize:Q=100,sizeRandomness:I=1,cameraDistance:D=20,disableRotation:ne=!1,pixelRatio:re,shape:ye="circle",glow:ut=.5,twinkle:dt=.3,depthOfField:ht=0,connections:mt=!1,connectionDistance:vt=110,hoverEffect:pt="parallax",hoverRadius:wt=140,clickBurst:xt=!0,drift:Rt="none",driftSpeed:yt=1,variation:At=0,intro:bt=!0,opacity:gt=1,lightMode:Et=!1,paused:Ft=!1,className:ke="",style:Mt})=>{const De=L.useRef(null),Oe=L.useRef(null),Ae=L.useRef(null),ze=(Array.isArray(g)?g:[g]).filter(Boolean).map(String),Ie={count:T(Math.round(r),1,zt),spread:Math.max(.1,y),speed:w,colors:ze.length?ze:["#ffffff"],mouse:z,hoverFactor:Math.max(0,E),soft:W,size:Math.max(0,Q),randomness:Math.max(0,I),camera:Math.max(1,D),rotate:!ne,dpr:re,shape:kt[ye]??0,glow:Math.max(0,ut),twinkle:T(dt,0,1),depthOfField:Math.max(0,ht),connections:mt,connectionDistance:Math.max(10,vt),hoverEffect:Dt[pt]??0,hoverRadius:Math.max(20,wt),clickBurst:xt,drift:Ot[Rt]??0,driftSpeed:yt,variation:Math.max(0,Math.round(At)),intro:bt,opacity:T(gt,0,1),lightMode:Et,paused:Ft},O=L.useRef(Ie);return O.current=Ie,L.useEffect(()=>{const X=De.current,V=Oe.current,e=V?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!X||!V||!e)return;const ie=it(e,Vt,Ut),U=it(e,Nt,Yt);if(!ie||!U)return;const se=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,se),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const be=e.createBuffer(),ge=e.createBuffer(),Ee=e.createBuffer(),Fe=e.createVertexArray();e.bindVertexArray(Fe),e.bindBuffer(e.ARRAY_BUFFER,se),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const Me=(t,o,n)=>{e.bindBuffer(e.ARRAY_BUFFER,t),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,n,e.FLOAT,!1,0,0),e.vertexAttribDivisor(o,1)};Me(be,1,3),Me(ge,2,4),Me(Ee,3,3);const Se=e.createBuffer(),_=new Float32Array(nt*8),Te=e.createVertexArray();e.bindVertexArray(Te),e.bindBuffer(e.ARRAY_BUFFER,se),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,Se),e.bufferData(e.ARRAY_BUFFER,_.byteLength,e.DYNAMIC_DRAW),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(2,1),e.bindVertexArray(null);const q=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),ee=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,Ve=new Map,Ue=t=>{const o=Ve.get(t);if(o)return o;let n=[1,1,1];if(q){q.clearRect(0,0,1,1),q.fillStyle="#ffffff",q.fillStyle=t,q.fillRect(0,0,1,1);const[i,f,a]=q.getImageData(0,0,1,1).data;n=[i/255,f/255,a/255]}return Ve.set(t,n),n},St=t=>{const o=t.map(f=>Math.pow(f,2.2)),n=.2126*o[0]+.7152*o[1]+.0722*o[2],i=Math.min(1,.06/Math.max(n,1e-4));return o.map(f=>Math.pow(f*i,1/2.2))},R={width:1,height:1,ratio:1},s={x:0,y:0,sx:0,sy:0,nx:0,ny:0,inside:!1,active:0},u={clock:0,spin:0,travel:0,offsetX:0,offsetY:0,reveal:O.current.intro&&!ee?0:1},B=[],Ne=new Float32Array(ae*4),x={key:"",count:0,positions:new Float32Array(0),randoms:new Float32Array(0),colors:new Float32Array(0)},d={x:new Float32Array(0),y:new Float32Array(0),ahead:new Float32Array(0),alpha:new Float32Array(0)};let G=0,j=0,ce=!0;const Tt=t=>{const o=`${t.count}|${t.variation}|${t.colors.join(",")}|${t.lightMode?1:0}`;if(o===x.key)return;x.key=o;const n=Ht(t.variation*7919+1),i=t.count,f=new Float32Array(i*3),a=new Float32Array(i*4),h=new Float32Array(i*3),l=t.colors.map(m=>t.lightMode?St(Ue(m)):Ue(m));for(let m=0;m<i;m++){let v,M,p,A;do v=n()*2-1,M=n()*2-1,p=n()*2-1,A=v*v+M*M+p*p;while(A>1||A===0);const P=Math.cbrt(n());f.set([v*P,M*P,p*P],m*3),a.set([n(),n(),n(),n()],m*4),h.set(l[Math.floor(n()*l.length)],m*3)}x.count=i,x.positions=f,x.randoms=a,x.colors=h;const c=Math.min(i,at);d.x=new Float32Array(c),d.y=new Float32Array(c),d.ahead=new Float32Array(c),d.alpha=new Float32Array(c),e.bindBuffer(e.ARRAY_BUFFER,be),e.bufferData(e.ARRAY_BUFFER,f,e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,ge),e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,Ee),e.bufferData(e.ARRAY_BUFFER,h,e.STATIC_DRAW)},Bt=t=>{const o=u.clock*1e3,n=t.rotate?Math.sin(o*2e-4)*.1:0,i=t.rotate?Math.cos(o*5e-4)*.15:0,f=t.rotate?u.spin:0,[a,h,l,c,m,v]=[Math.sin(n),Math.cos(n),Math.sin(i),Math.cos(i),Math.sin(f),Math.cos(f)];return[c*v+l*a*m,h*m,-l*v+c*a*m,-c*m+l*a*v,h*v,l*m+c*a*v,l*h,-a,c*h]},Ye=()=>[u.offsetX,u.offsetY,-(1-$t(u.reveal))*70],Pt=(t,o)=>{const n=Math.min(x.count,at),[i,f,a]=Ye(),h=R.width/R.height,l=u.clock,c=t.hoverRadius,m=t.hoverEffect!==0?s.active:0,v=t.spread*2+3,M=t.spread*xe*2+3;for(let p=0;p<n;p++){const A=x.positions[p*3]*t.spread,P=x.positions[p*3+1]*t.spread,S=x.positions[p*3+2]*t.spread*xe,te=x.randoms[p*4],Z=x.randoms[p*4+1],J=x.randoms[p*4+2],N=x.randoms[p*4+3],ue=Math.sin(l*J+6.28*N)*(.1+1.4*te),C=Math.sin(l*Z+6.28*te)*(.1+1.4*N),Je=Math.sin(l*N+6.28*Z)*(.1+1.4*J),Lt=o[0]*A+o[3]*P+o[6]*S+i+ue;let Qe=o[1]*A+o[4]*P+o[7]*S+f+C,et=o[2]*A+o[5]*P+o[8]*S+a+Je,de=1;if(t.drift===1||t.drift===2){const F=st(N*v+f+C+(t.drift===1?u.travel:-u.travel),v);Qe=F-v/2;const b=T(F/(v*.12),0,1),k=T((v-F)/(v*.12),0,1);de=b*b*(3-2*b)*k*k*(3-2*k)}else if(t.drift===3){const F=st(Z*M+a+Je+u.travel,M);et=F-M/2;const b=T(F/(M*.1),0,1);de=b*b*(3-2*b)}const Y=t.camera-et;if(Y<ct||Y>$){d.alpha[p]=0;continue}const Pe=T((Y-1)/3,0,1);de*=Pe*Pe*(3-2*Pe);let he=Lt*Re/h/Y*.5*R.width+R.width/2,me=Qe*Re/Y*.5*R.height+R.height/2,ve=0,pe=0;if(m>.001){const F=he-s.sx,b=me-s.sy,k=Math.hypot(F,b),H=Math.exp(-(F*F+b*b)/(c*c))*t.hoverFactor*m;t.hoverEffect===1&&k>.001?(ve+=F/k*c*.5*H,pe+=b/k*c*.5*H):t.hoverEffect===2&&(ve-=F*.6*H,pe-=b*.6*H)}for(const F of B){const b=F.age/_e,k=he-F.x,H=me-F.y,oe=Math.hypot(k,H);if(oe<.001)continue;const _t=Math.exp(-Math.pow((oe-b*ft)/lt,2)),Le=T(oe/30,0,1),ot=_t*(1-b)*(1-b)*56*Le*Le*(3-2*Le);ve+=k/oe*ot,pe+=H/oe*ot}he+=ve,me+=pe;const Ce=T(($-Y)/($-$*.9),0,1),tt=T(u.reveal*1.6-J*.6,0,1);d.x[p]=he,d.y[p]=me,d.ahead[p]=Y,d.alpha[p]=Ce*Ce*(3-2*Ce)*de*tt*tt}return n},Ct=(t,o)=>{const n=Pt(t,o),i=t.connectionDistance,f=Math.max(1,Math.ceil(R.width/i)+2),a=new Map;for(let c=0;c<n;c++){if(d.alpha[c]<.02)continue;const m=(Math.floor(d.y[c]/i)+1)*f+Math.floor(d.x[c]/i)+1,v=a.get(m);v?v.push(c):a.set(m,[c])}let h=0;const l=i*i;for(const[c,m]of a)for(const v of[0,1,f-1,f,f+1]){const M=v===0?m:a.get(c+v);if(M)for(let p=0;p<m.length;p++){const A=m[p];for(let P=v===0?p+1:0;P<M.length;P++){const S=M[P],te=d.x[A]-d.x[S],Z=d.y[A]-d.y[S],J=te*te+Z*Z;if(J>l)continue;const N=T(1-Math.abs(d.ahead[A]-d.ahead[S])/18,0,1);if(N<=0)continue;if(h>=nt)return h;const ue=1-Math.sqrt(J)/i,C=h*8;_[C]=d.x[A],_[C+1]=d.y[A],_[C+2]=d.x[S],_[C+3]=d.y[S],_[C+4]=(x.colors[A*3]+x.colors[S*3])/2,_[C+5]=(x.colors[A*3+1]+x.colors[S*3+1])/2,_[C+6]=(x.colors[A*3+2]+x.colors[S*3+2])/2,_[C+7]=ue*ue*N*.7*Math.min(d.alpha[A],d.alpha[S]),h++}}}return h},fe=()=>{const t=O.current;Tt(t);const o=Bt(t),[n,i,f]=Ye();if(e.viewport(0,0,V.width,V.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),t.connections){const l=Ct(t,o);l&&(e.useProgram(U.program),e.bindVertexArray(Te),e.bindBuffer(e.ARRAY_BUFFER,Se),e.bufferSubData(e.ARRAY_BUFFER,0,_.subarray(0,l*8)),e.uniform2f(U.uniforms.uView,R.width,R.height),e.uniform1f(U.uniforms.uRatio,R.ratio),e.uniform1f(U.uniforms.uWidth,1),e.uniform1f(U.uniforms.uOpacity,t.opacity),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,l))}const a=ie.uniforms;let h=0;for(let l=B.length-1;l>=0&&h<ae;l--)Ne.set([B[l].x,B[l].y,B[l].age/_e,1],h*4),h++;e.useProgram(ie.program),e.bindVertexArray(Fe),e.uniformMatrix3fv(a.uRotation,!1,o),e.uniform3f(a.uOffset,n,i,f),e.uniform1f(a.uSpread,t.spread),e.uniform1f(a.uTime,u.clock),e.uniform1f(a.uCamera,t.camera),e.uniform1f(a.uAspect,R.width/R.height),e.uniform2f(a.uView,R.width,R.height),e.uniform1f(a.uRatio,R.ratio),e.uniform1f(a.uSize,t.size),e.uniform1f(a.uRandomness,t.randomness),e.uniform1f(a.uBlur,t.depthOfField*14),e.uniform1f(a.uFocus,t.camera+14),e.uniform1f(a.uGlow,t.lightMode?t.glow*.3:t.glow),e.uniform1f(a.uTwinkle,t.twinkle),e.uniform1i(a.uShape,t.shape),e.uniform1i(a.uDrift,t.drift),e.uniform1f(a.uTravel,u.travel),e.uniform4f(a.uPointer,s.sx,s.sy,s.active,t.hoverRadius),e.uniform1i(a.uEffect,t.hoverEffect),e.uniform1f(a.uStrength,t.hoverFactor),e.uniform4fv(a.uBursts,Ne),e.uniform1i(a.uBurstCount,h),e.uniform1f(a.uReveal,u.reveal),e.uniform1f(a.uSoft,t.soft?.2:0),e.uniform1f(a.uShimmer,t.lightMode?0:1),e.uniform1f(a.uOpacity,t.opacity),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,x.count),e.bindVertexArray(null)},He=t=>{if(G=0,!ce||document.hidden)return;const o=O.current,n=j?T((t-j)/1e3,5e-4,.05):1/60;if(j=t,o.paused){u.reveal=1,fe(),j=0;return}const i=ee?0:1,f=n*o.speed*i;u.clock+=f,o.rotate&&(u.spin+=f*.6),u.travel+=n*o.driftSpeed*i*(o.drift===3?6:.9);const a=o.mouse&&s.inside&&!ee,h=1-Math.exp(-n/.35),l=a&&o.hoverEffect===0?o.hoverFactor:0;u.offsetX+=(-s.nx*l-u.offsetX)*h,u.offsetY+=(-s.ny*l-u.offsetY)*h,s.sx+=(s.x-s.sx)*(1-Math.exp(-n/.06)),s.sy+=(s.y-s.sy)*(1-Math.exp(-n/.06)),s.active+=((a?1:0)-s.active)*(1-Math.exp(-n/.2));for(let c=B.length-1;c>=0;c--)B[c].age+=n,B[c].age>=_e&&B.splice(c,1);!o.intro||ee?u.reveal=1:u.reveal<1&&(u.reveal=Math.min(1,u.reveal+n/It)),fe(),G=requestAnimationFrame(He)},K=()=>{!G&&ce&&!document.hidden&&(G=requestAnimationFrame(He))},Be=()=>{const t=O.current,o=Math.max(1,X.clientWidth),n=Math.max(1,X.clientHeight),i=Math.min(t.dpr||window.devicePixelRatio||1,2);R.width=o,R.height=n,V.width=Math.max(1,Math.round(o*i)),V.height=Math.max(1,Math.round(n*i)),R.ratio=V.width/o,fe(),K()},$e=t=>{const o=X.getBoundingClientRect(),n=t.clientX-o.left,i=t.clientY-o.top,f=s.inside;s.inside=n>=0&&i>=0&&n<=o.width&&i<=o.height,s.x=n,s.y=o.height-i,s.nx=n/Math.max(1,o.width)*2-1,s.ny=-(i/Math.max(1,o.height)*2-1),s.inside&&!f&&(s.sx=s.x,s.sy=s.y)},We=t=>{$e(t),O.current.paused||K()},Xe=t=>{const o=O.current;$e(t),!(!s.inside||!o.clickBurst||o.paused||ee)&&(B.push({x:s.x,y:s.y,age:0}),B.length>ae&&B.shift(),K())},le=t=>{t.pointerType!=="mouse"&&(s.inside=!1)},qe=()=>{s.inside=!1},Ge=()=>{j=0,K()},je=new ResizeObserver(Be);je.observe(X);const Ke=new IntersectionObserver(t=>{ce=t.some(o=>o.isIntersecting),ce&&(j=0,K())});Ke.observe(X),window.addEventListener("pointermove",We,{passive:!0}),window.addEventListener("pointerdown",Xe,{passive:!0}),window.addEventListener("pointerup",le,{passive:!0}),window.addEventListener("pointercancel",le,{passive:!0}),document.documentElement.addEventListener("pointerleave",qe),document.addEventListener("visibilitychange",Ge),Be();let Ze=O.current.dpr;return Ae.current=()=>{const t=O.current;if(t.dpr!==Ze){Ze=t.dpr,Be();return}G||fe(),K()},()=>{cancelAnimationFrame(G),Ae.current=null,je.disconnect(),Ke.disconnect(),window.removeEventListener("pointermove",We),window.removeEventListener("pointerdown",Xe),window.removeEventListener("pointerup",le),window.removeEventListener("pointercancel",le),document.documentElement.removeEventListener("pointerleave",qe),document.removeEventListener("visibilitychange",Ge),e.deleteProgram(ie.program),e.deleteProgram(U.program),[se,be,ge,Ee,Se].forEach(t=>e.deleteBuffer(t)),e.deleteVertexArray(Fe),e.deleteVertexArray(Te),V.isConnected||e.getExtension("WEBGL_lose_context")?.loseContext()}},[]),L.useEffect(()=>{Ae.current?.()}),we.jsx("div",{ref:De,className:`particles-container${ke?` ${ke}`:""}`,style:Mt,children:we.jsx("canvas",{ref:Oe,className:"particles-canvas","aria-hidden":"true"})})};function jt(){const r=L.useRef(null),[y,w]=L.useState(!1),[g,z]=L.useState(!1),[E,W]=L.useState(40);return L.useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const Q=window.innerWidth<900;W(Q?40:90);let I=0;const D=()=>{I=window.setTimeout(()=>w(!0),200)};document.readyState==="complete"?D():window.addEventListener("load",D,{once:!0});const ne=new IntersectionObserver(([ye])=>z(!ye.isIntersecting));r.current&&ne.observe(r.current);const re=()=>z(document.hidden);return document.addEventListener("visibilitychange",re),()=>{window.clearTimeout(I),window.removeEventListener("load",D),ne.disconnect(),document.removeEventListener("visibilitychange",re)}},[]),we.jsx("div",{ref:r,className:"hero-lights","aria-hidden":"true",children:y&&we.jsx(Wt,{particleCount:E,particleSpread:10,speed:.06,particleColors:["#fff1c9","#f2cf83","#ffffff"],alphaParticles:!0,particleBaseSize:E===40?70:90,sizeRandomness:.9,cameraDistance:20,disableRotation:!0,pixelRatio:E===40?1:Math.min(window.devicePixelRatio||1,1.5),intro:!1,twinkle:.8,glow:.6,drift:"up",driftSpeed:.35,moveParticlesOnHover:!1,clickBurst:!1,paused:g})})}export{jt as default};
