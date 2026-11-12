import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface RibbonProject {
  order: number;
  id: string;
  title: string;
  url: string;
  image: string;
}

export const SHAKURO_PROJECTS: RibbonProject[] = [
  {
    order: 1,
    id: "27803181",
    title: "UPFORM — Athlete Performance",
    url: "https://dribbble.com/shots/27803181-AI-Athlete-Performance-Recovery-Mobile-App-Design",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/27803181.webp"
  },
  {
    order: 2,
    id: "26299029",
    title: "Prime Chat AI — Mobile Assistant",
    url: "https://dribbble.com/shots/26299029-Prime-Chat-AI-Mobile-Assistant-UI-UX-Design-for-Task-Automation",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/26299029.webp"
  },
  {
    order: 3,
    id: "25156786",
    title: "Monarch — Chauffeur App",
    url: "https://dribbble.com/shots/25156786-High-End-Chauffeur-Service-App",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/25156786.webp"
  },
  {
    order: 5,
    id: "24673090",
    title: "Team Management — Daily Workflow",
    url: "https://dribbble.com/shots/24673090-Team-Management-Dashboard-UI-Animation",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/24673090.webp"
  },
  {
    order: 7,
    id: "25619132",
    title: "ComfyUI — Workflow Redesign",
    url: "https://dribbble.com/shots/25619132-Web-Interface-Redesign-for-a-Stable-Diffusion-Solution",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/25619132.webp"
  },
  {
    order: 9,
    id: "27340771",
    title: "Owari — Energy Market Analytics",
    url: "https://dribbble.com/shots/27340771-Dashboard-Design-for-Stock-Trading-Platform",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/27340771.webp"
  },
  {
    order: 10,
    id: "21759887",
    title: "Abyss — Crypto Exchange App",
    url: "https://dribbble.com/shots/21759887-Abyss-Crypto-Exchange-Mobile-App",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/21759887.webp"
  },
  {
    order: 11,
    id: "27601386",
    title: "Trading Dashboard",
    url: "https://dribbble.com/shots/27601386-Trading-Dashboard-for-Market-Data-Analysis-and-Execution",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/27601386.webp"
  },
  {
    order: 12,
    id: "25454301",
    title: "Cashmate — Finance Dashboard",
    url: "https://dribbble.com/shots/25454301-Finance-Management-Web-Dashboard",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/25454301.webp"
  },
  {
    order: 14,
    id: "25900599",
    title: "Crypto Exchange — Portfolio Dashboard",
    url: "https://dribbble.com/shots/25900599-Crypto-Exchange-Web-Platform",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/25900599.webp"
  },
  {
    order: 15,
    id: "20763658",
    title: "Void — Gaming Analytics",
    url: "https://dribbble.com/shots/20763658-Elements-for-Game-Portal-Website-Concept",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/20763658.webp"
  },
  {
    order: 17,
    id: "26530423",
    title: "TraderTale — Trading Community",
    url: "https://dribbble.com/shots/26530423-UI-UX-Design-for-TraderTale-Social-Platform-for-Traders",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/26530423.webp"
  },
  {
    order: 18,
    id: "25764275",
    title: "Developer Community",
    url: "https://dribbble.com/shots/25764275-Social-Media-Platform-for-Developers",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/25764275.webp"
  },
  {
    order: 20,
    id: "26249804",
    title: "AJP — Jiu-Jitsu Platform",
    url: "https://dribbble.com/shots/26249804-Website-Design-for-AJP-Jiu-Jitsu-Tournament-Platform",
    image: "https://shakuro-ribbon-gallery.vercel.app/assets/projects/26249804.webp"
  }
];

interface MotionState {
  offset: number;
  velocity: number;
  pointerX: number;
  pointerY: number;
  parallaxX: number;
  parallaxY: number;
}

function wrap(value: number, period: number): number {
  return ((value % period) + period) % period;
}

function advanceMotion(state: MotionState, frames: number, count: number, reduced: boolean) {
  const decay = Math.pow(0.94, frames);
  state.offset = wrap(state.offset + (reduced ? 0 : state.velocity * 0.94 * (1 - decay) / 0.06), count);
  state.velocity = reduced ? 0 : state.velocity * decay;
  const smoothing = 1 - Math.pow(0.968, frames);
  state.parallaxX = reduced ? 0 : state.parallaxX + (state.pointerX - state.parallaxX) * smoothing;
  state.parallaxY = reduced ? 0 : state.parallaxY + (state.pointerY - state.parallaxY) * smoothing;
}

let ribbonPathCache: { samples: any[]; length: number } | null = null;

function ribbonPath() {
  if (ribbonPathCache) return ribbonPathCache;
  const depthSpan = 24, extraReach = 3.2;
  const rearSpan = 14, rearReach = 5.4;
  const arcRadius = 13, arcX = -1.3, arcZ = 18.6 - arcRadius;
  const arcStart = 0.34, arcEnd = -1.38;
  const entryCos = Math.cos(arcStart), entrySin = Math.sin(arcStart);
  const entry: [number, number] = [arcX + arcRadius * entrySin, arcZ + arcRadius * entryCos - (0.6 + extraReach)];

  const curves: [number, number][][] = [
    [[70, -11], [48, -12], [32, -11.5], [22, -10]],
    [[22, -10], [12, -8.5], [-4, -10], [-8, -9]],
    [[-8, -9], [-12, -8], [-12, -2 - 8 / 7], [-8, -2]],
    [[-8, -2], [-8 + 4.6, -2 + 4.6 * 2 / 7], [8 - 2.441, 4 - 2.441 * 4.2], [8, 4]],
    [[8, 4], [9.6, 10.72], [entry[0] + 2.878 * entryCos, entry[1] - 2.878 * entrySin], entry],
  ];
  const samples: { x: number; y: number; z: number; nx: number; nz: number; distance: number }[] = [];
  let length = 0;
  function appendSample(x: number, y: number, z: number, dx: number, dz: number) {
    const speed = Math.hypot(dx, dz);
    const previous = samples[samples.length - 1];
    if (previous) length += Math.hypot(x - previous.x, y - previous.y, z - previous.z);
    samples.push({ x, y, z, nx: -dz / speed, nz: dx / speed, distance: length });
  }

  for (const [a, b, c, d] of curves) {
    for (let i = samples.length ? 1 : 0; i <= 128; i++) {
      const t = i / 128, u = 1 - t;
      const x = u*u*u*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t*t*t*d[0];
      const baseZ = u*u*u*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t*t*t*d[1];
      const rearProgress = Math.max(0, Math.min(1, (baseZ + 3) / rearSpan));
      const rearBlend = Math.pow(rearProgress, 3) * (10 + rearProgress * (-15 + 6 * rearProgress));
      const approach = Math.max(0, Math.min(1, (baseZ + 10) / depthSpan));
      const blend = Math.pow(approach, 3) * (10 + approach * (-15 + 6 * approach));
      const advance = 0.6 + extraReach * blend + rearReach * (1 - rearBlend);
      const z = baseZ + advance;
      const y = 1.62 - 0.29 * blend;
      const dx = 3*u*u*(b[0]-a[0]) + 6*u*t*(c[0]-b[0]) + 3*t*t*(d[0]-c[0]);
      const baseDz = 3*u*u*(b[1]-a[1]) + 6*u*t*(c[1]-b[1]) + 3*t*t*(d[1]-c[1]);
      const approachSlope = 30 * extraReach / depthSpan * Math.pow(approach * (1 - approach), 2);
      const rearSlope = 30 * rearReach / rearSpan * Math.pow(rearProgress * (1 - rearProgress), 2);
      const dz = baseDz * (1 + approachSlope - rearSlope);
      appendSample(x, y, z, dx, dz);
    }
  }

  const arcHeight = samples[samples.length - 1].y;
  const exitStart = -0.84, exitSpan = exitStart - arcEnd, exitReach = 15;
  for (let i = 1; i <= 256; i++) {
    const angle = arcStart + (arcEnd - arcStart) * i / 256;
    const sin = Math.sin(angle), cos = Math.cos(angle);
    const exit = Math.max(0, (exitStart - angle) / exitSpan);
    const x = arcX + arcRadius * sin - exitReach * Math.pow(exit, 3);
    const dx = -arcRadius * cos - 3 * exitReach * Math.pow(exit, 2) / exitSpan;
    appendSample(x, arcHeight, arcZ + arcRadius * cos, dx, arcRadius * sin);
  }
  ribbonPathCache = { samples, length };
  return ribbonPathCache;
}

function ribbonLayout() {
  return { height: 2.4, length: ribbonPath().length };
}

function conveyorPoint(t: number) {
  const { samples, length } = ribbonPath();
  const distance = Math.max(0, Math.min(1, t)) * length;
  let low = 0, high = samples.length - 1;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (samples[middle].distance < distance) low = middle;
    else high = middle;
  }
  const a = samples[low], b = samples[high];
  const f = (distance - a.distance) / (b.distance - a.distance);
  const nx = a.nx + (b.nx - a.nx) * f, nz = a.nz + (b.nz - a.nz) * f;
  const normalLength = Math.hypot(nx, nz);
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    z: a.z + (b.z - a.z) * f,
    nx: nx / normalLength,
    nz: nz / normalLength
  };
}

function buildConveyorGeometry(segments = 512) {
  const { height, length } = ribbonLayout();
  const tileWidth = height * 4 / 3;
  const vertices = new Float32Array((segments + 1) * 2 * 8);
  const indices = new Uint16Array(segments * 6);
  for (let i = 0; i <= segments; i++) {
    const point = conveyorPoint(i / segments);
    const progress = Math.max(0, (i / segments - 0.82) / 0.18);
    const twist = Math.PI / 4 * Math.pow(progress, 3) * (10 + progress * (-15 + 6 * progress));
    const vertical = Math.cos(twist), horizontal = -Math.sin(twist);
    for (let side = 0; side < 2; side++) {
      const across = (side - 0.5) * height;
      vertices.set([
        point.x + point.nx * across * horizontal,
        point.y + across * vertical,
        point.z + point.nz * across * horizontal,
        i / segments * length / tileWidth,
        side,
        point.nx * vertical,
        -horizontal,
        point.nz * vertical
      ], (i * 2 + side) * 8);
    }
    if (i < segments) {
      const a = i * 2;
      indices.set([a, a + 2, a + 1, a + 1, a + 2, a + 3], i * 6);
    }
  }
  return { vertices, indices };
}

function ribbonView(state: MotionState, width: number, height: number) {
  const aspect = width / height;
  const widePullback = Math.min(0.06, Math.max(0, (aspect - 1.45) * 0.19));
  const zoom = Math.min(1.3, Math.max(1 + widePullback, 1.45 / aspect));
  return {
    camera: [(-1 + state.parallaxX * 0.12) * zoom, (4.8 - state.parallaxY * 0.12) * zoom, 24 * zoom] as [number, number, number],
    target: [-2, -3, 4] as [number, number, number],
    rig: [-state.parallaxY * 0.005, state.parallaxX * 0.012, -0.012] as [number, number, number],
  };
}

const projectionScale = 2.9042109;
const verticalShift = 0.005;
const floorHeight = 0.105;

function createConveyor(canvas: HTMLCanvasElement, images: (HTMLImageElement | null)[], projects: RibbonProject[]) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) throw new Error("WebGL is unavailable.");
  const ribbonPass = 0, reflectionPass = 1, floorPass = 2, blurPass = 3;
  const vertexSource = `
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 normal;
    uniform vec3 rig, camera, target;
    uniform float aspect, floorHeight;
    uniform lowp int surface;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vAcross;
    varying vec3 vView;
    varying float vHeightAboveFloor;
    vec3 rotate(vec3 p, vec3 r) {
      vec3 c = cos(r), s = sin(r);
      p.xy = mat2(c.z, s.z, -s.z, c.z) * p.xy;
      p.xz = mat2(c.y, -s.y, s.y, c.y) * p.xz;
      p.yz = mat2(c.x, s.x, -s.x, c.x) * p.yz;
      return p;
    }
    void main() {
      if (surface == ${blurPass}) {
        gl_Position = vec4(position.xy, 0.0, 1.0);
        return;
      }
      vUv = uv;
      vec3 forward = normalize(target - camera);
      vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
      vec3 up = cross(right, forward);
      vec3 world = surface == ${floorPass} ? position : rotate(position, rig);
      vHeightAboveFloor = world.y - floorHeight;
      vNormal = rotate(normal, rig);
      vAcross = rotate(cross(normal, cross(vec3(0.0, 1.0, 0.0), normal)), rig);
      if (surface == ${reflectionPass}) world.y = 2.0 * floorHeight - world.y;
      vec3 delta = world - camera;
      vec3 view = vec3(dot(delta, right), dot(delta, up), -dot(delta, forward));
      vView = -delta;
      if (surface == ${reflectionPass}) vView.y = -vView.y;
      gl_Position = vec4(view.x * ${projectionScale} / aspect, view.y * ${projectionScale}, -1.002002 * view.z - 0.2002002, -view.z);
      gl_Position.y -= gl_Position.w * ${verticalShift};
    }`;
  const fragmentSource = `
    precision highp float;
    uniform sampler2D atlas, reflection, softReflection;
    uniform float offset, count, picking;
    uniform lowp int surface;
    uniform vec2 grid, atlasSize, sceneSize;
    uniform vec2 reflectionSize, blurStep;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vAcross;
    varying vec3 vView;
    varying float vHeightAboveFloor;
    vec4 blurReflection() {
      vec2 screen = gl_FragCoord.xy / reflectionSize;
      vec4 blurred = texture2D(reflection, screen) * 0.145328;
      vec2 tap = blurStep * 1.452314;
      blurred += (texture2D(reflection, screen - tap) + texture2D(reflection, screen + tap)) * 0.248955;
      tap = blurStep * 3.390210;
      blurred += (texture2D(reflection, screen - tap) + texture2D(reflection, screen + tap)) * 0.134244;
      tap = blurStep * 5.331473;
      blurred += (texture2D(reflection, screen - tap) + texture2D(reflection, screen + tap)) * 0.044137;
      return blurred;
    }
    vec4 glassFloor() {
      vec3 view = normalize(vView);
      float fresnel = pow(1.0 - max(view.y, 0.0), 2.0);
      float distanceToFloor = length(vView);
      float visibility = 1.0 - smoothstep(26.0, 61.0, distanceToFloor);
      vec2 poolPosition = (vUv - vec2(-1.0, 8.0)) / vec2(13.0, 20.0);
      float pool = exp(-dot(poolPosition, poolPosition));
      vec3 glass = mix(vec3(0.012, 0.017, 0.024), vec3(0.068, 0.080, 0.100), pool);
      float floorAlpha = visibility * (0.12 + pool * 0.48);
      vec2 screen = gl_FragCoord.xy / sceneSize;
      vec4 sharp = texture2D(reflection, screen);
      float detail = 0.42 * smoothstep(0.52, 0.92, sharp.a);
      vec4 mirror = mix(texture2D(softReflection, screen), sharp, detail);
      float amount = (0.32 + 0.29 * fresnel) * (1.0 - smoothstep(15.0, 45.0, distanceToFloor));
      float uncovered = 1.0 - mirror.a * amount;
      float alpha = mirror.a * amount + floorAlpha * uncovered;
      vec3 color = glass * floorAlpha * uncovered + mirror.rgb * vec3(0.76, 0.86, 0.96) * amount;
      return vec4(color / max(alpha, 0.0001), alpha);
    }
    vec3 edgeLight(vec3 normal, vec3 view) {
      float across = vUv.y * 2.0 - 1.0;
      float bevel = smoothstep(0.962, 1.0, abs(across));
      vec3 rim = normalize(normal + normalize(vAcross) * sign(across) * bevel * 1.65);
      vec3 key = normalize(vec3(-0.48, 0.84, 0.36) + view);
      vec3 fill = normalize(vec3(0.32, -0.92, -0.22) + view);
      float keyGlint = pow(max(0.0, dot(rim, key)), 20.0);
      float fillGlint = pow(max(0.0, dot(rim, fill)), 12.0);
      return bevel * (vec3(0.025, 0.032, 0.040)
        + vec3(0.58, 0.63, 0.70) * keyGlint + vec3(0.32, 0.43, 0.56) * fillGlint);
    }
    void main() {
      if (surface == ${blurPass}) { gl_FragColor = blurReflection(); return; }
      if (surface == ${floorPass}) { gl_FragColor = glassFloor(); return; }
      if (surface == ${reflectionPass} && vHeightAboveFloor < 0.0) discard;
      vec3 normal = normalize(vNormal);
      vec3 light = normalize(vec3(-0.4, 0.9, 1.0));
      float phase = mod(vUv.x + offset, count);
      float tile = floor(phase);
      if (picking > 0.5) { gl_FragColor = vec4((tile + 1.0) / 255.0, 0.0, 0.0, 1.0); return; }
      vec2 cell = vec2(mod(tile, grid.x), floor(tile / grid.x));
      float side = dot(normal, vView) >= 0.0 ? 1.0 : -1.0;
      vec2 local = vec2(side > 0.0 ? fract(phase) : 1.0 - fract(phase), 1.0 - vUv.y);
      vec2 inset = 0.5 * grid / atlasSize;
      vec2 sampleUv = (cell + mix(inset, 1.0 - inset, local)) / grid;
      vec3 color = texture2D(atlas, sampleUv).rgb;
      normal *= side;
      vec3 view = normalize(vView);
      float diffuse = max(0.0, dot(normal, light));
      float ambient = 0.56;
      float highlight = pow(max(0.0, dot(normal, normalize(light + view))), 36.0) * 0.055;
      float luma = dot(color, vec3(0.299, 0.587, 0.114));
      color = max(vec3(0.0), mix(vec3(luma), color, 1.04));
      vec3 lit = pow(color, vec3(2.2)) * (ambient * vec3(0.94, 0.97, 1.0) + diffuse * 0.62 + highlight);
      float alpha = surface == ${reflectionPass} ? mix(0.92, 0.40, smoothstep(0.0, 1.0, vUv.y)) : 1.0;
      vec3 encoded = pow(clamp(lit, 0.0, 1.0), vec3(1.0 / 2.2));
      encoded += (1.0 - encoded) * edgeLight(normal, view);
      gl_FragColor = vec4(encoded * alpha, alpha);
    }`;

  const program = gl.createProgram()!;
  const shaders: WebGLShader[] = [];
  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
      const shader = gl.createShader(type)!;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Program linking failed');
  } catch (error) {
    gl.deleteProgram(program);
    throw error;
  } finally {
    shaders.forEach(shader => gl.deleteShader(shader));
  }

  gl.useProgram(program);
  const geometry = buildConveyorGeometry();
  const floorVertices = [[-90, -70], [90, -70], [-90, 40], [90, 40]]
    .flatMap(([x, z]) => [x, floorHeight, z, x, z, 0, 1, 0]);
  const blurVertices = [[-1, -1], [3, -1], [-1, 3]]
    .flatMap(([x, y]) => [x, y, 0, 0, 0, 0, 1, 0]);
  const floorStart = geometry.vertices.length / 8;
  const blurStart = floorStart + floorVertices.length / 8;
  const vertices = new Float32Array(geometry.vertices.length + floorVertices.length + blurVertices.length);
  vertices.set(geometry.vertices);
  vertices.set(floorVertices, geometry.vertices.length);
  vertices.set(blurVertices, blurStart * 8);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  for (const [name, size, start] of [["position", 3, 0], ["uv", 2, 3], ["normal", 3, 5]] as const) {
    const attribute = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 32, start * 4);
  }

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);

  const columns = Math.ceil(Math.sqrt(projects.length * 0.75));
  const rows = Math.ceil(projects.length / columns);
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxReflectionSize = Math.min(maxTextureSize, gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
  const maxSize = Math.min(4096, maxTextureSize);
  const tileWidth = Math.floor(Math.min(1200, maxSize / columns, maxSize / rows * 4 / 3) / 4) * 4;
  const tileHeight = tileWidth * 0.75;
  const atlas = document.createElement("canvas");
  atlas.width = columns * tileWidth;
  atlas.height = rows * tileHeight;
  const ctx = atlas.getContext("2d")!;
  ctx.fillStyle = "#0f1316";
  ctx.fillRect(0, 0, atlas.width, atlas.height);

  images.forEach((image, index) => {
    const x = index % columns * tileWidth, y = Math.floor(index / columns) * tileHeight;
    if (image && image.complete && image.naturalWidth > 0) {
      const scale = Math.min(tileWidth / image.naturalWidth, tileHeight / image.naturalHeight);
      const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
      ctx.drawImage(image, x + (tileWidth - width) / 2, y + (tileHeight - height) / 2, width, height);
    } else {
      const grad = ctx.createLinearGradient(x, y, x + tileWidth, y + tileHeight);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, tileWidth, tileHeight);

      ctx.fillStyle = '#e11d48';
      ctx.fillRect(x + 24, y + 24, 48, 4);

      ctx.fillStyle = '#f8fafc';
      ctx.font = `bold ${Math.max(16, Math.round(tileWidth / 22))}px sans-serif`;
      ctx.fillText(projects[index].title, x + 24, y + tileHeight / 2, tileWidth - 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `${Math.max(12, Math.round(tileWidth / 36))}px monospace`;
      ctx.fillText('ANALYTICS & BI SHOWCASE', x + 24, y + tileHeight / 2 + 32, tileWidth - 48);
    }
  });

  function setupTexture(unit: number) {
    const texture = gl!.createTexture();
    gl!.activeTexture(unit);
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    return texture;
  }

  setupTexture(gl.TEXTURE0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
  const anisotropy = gl.getExtension("EXT_texture_filter_anisotropic");
  if (anisotropy) {
    gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
      Math.min(8, gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  }

  const reflection = setupTexture(gl.TEXTURE1);
  const blurTexture = setupTexture(gl.TEXTURE1);
  const softReflection = setupTexture(gl.TEXTURE1);
  const reflectionBuffer = gl.createFramebuffer();
  const reflectionDepth = gl.createRenderbuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, reflectionBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, reflection, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, reflectionDepth);

  const blurBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, blurBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blurTexture, 0);

  const softReflectionBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, softReflectionBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, softReflection, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  const uniformNames = ["rig", "camera", "target", "aspect", "offset", "count", "picking", "surface", "floorHeight",
    "grid", "atlasSize", "reflection", "softReflection", "sceneSize", "reflectionSize", "blurStep"];
  const locations = Object.fromEntries(uniformNames.map(name => [name, gl!.getUniformLocation(program, name)]));

  gl.uniform1i(locations.reflection, 1);
  gl.uniform1i(locations.softReflection, 2);
  gl.uniform1f(locations.floorHeight, floorHeight);
  gl.uniform1f(locations.count, projects.length);
  gl.uniform2f(locations.grid, columns, rows);
  gl.uniform2f(locations.atlasSize, atlas.width, atlas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  let viewportWidth = 1, viewportHeight = 1;
  let reflectionWidth = 1, reflectionHeight = 1;
  const pixel = new Uint8Array(4);

  function blurReflection(target: WebGLFramebuffer | null, source: WebGLTexture | null, stepX: number, stepY: number) {
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, target);
    gl!.bindTexture(gl!.TEXTURE_2D, source);
    gl!.uniform2f(locations.blurStep, stepX, stepY);
    gl!.drawArrays(gl!.TRIANGLES, blurStart, 3);
  }

  function draw(state: MotionState, picking = false) {
    const view = ribbonView(state, viewportWidth, viewportHeight);
    gl!.uniform3f(locations.camera, ...view.camera);
    gl!.uniform3f(locations.target, ...view.target);
    gl!.uniform3f(locations.rig, ...view.rig);
    gl!.uniform1f(locations.offset, state.offset);
    gl!.uniform1f(locations.picking, picking ? 1 : 0);
    if (picking) {
      gl!.disable(gl!.DITHER);
    } else {
      gl!.enable(gl!.DITHER);
      gl!.bindTexture(gl!.TEXTURE_2D, null);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, reflectionBuffer);
      gl!.viewport(0, 0, reflectionWidth, reflectionHeight);
      gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
      gl!.uniform1i(locations.surface, reflectionPass);
      gl!.drawElements(gl!.TRIANGLES, geometry.indices.length, gl!.UNSIGNED_SHORT, 0);

      gl!.disable(gl!.DEPTH_TEST);
      gl!.uniform1i(locations.surface, blurPass);
      blurReflection(blurBuffer, reflection, 1 / reflectionWidth, 0);
      blurReflection(softReflectionBuffer, blurTexture, 0, 1 / reflectionHeight);
      gl!.enable(gl!.DEPTH_TEST);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.bindTexture(gl!.TEXTURE_2D, reflection);
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
    if (!picking) {
      gl!.uniform1i(locations.surface, floorPass);
      gl!.activeTexture(gl!.TEXTURE2);
      gl!.bindTexture(gl!.TEXTURE_2D, softReflection);
      gl!.depthMask(false);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, floorStart, 4);
      gl!.depthMask(true);
      gl!.bindTexture(gl!.TEXTURE_2D, null);
      gl!.activeTexture(gl!.TEXTURE1);
    }
    gl!.uniform1i(locations.surface, ribbonPass);
    gl!.drawElements(gl!.TRIANGLES, geometry.indices.length, gl!.UNSIGNED_SHORT, 0);
  }

  return {
    draw,
    resize(width: number, height: number) {
      viewportWidth = width;
      viewportHeight = height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2, maxTextureSize / Math.max(width, height));
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform1f(locations.aspect, width / height);
      gl!.uniform2f(locations.sceneSize, canvas.width, canvas.height);
      const reflectionScale = Math.min(0.5, 420 / height, maxReflectionSize / Math.max(width, height));
      reflectionWidth = Math.max(1, Math.round(width * reflectionScale));
      reflectionHeight = Math.max(1, Math.round(height * reflectionScale));
      gl!.uniform2f(locations.reflectionSize, reflectionWidth, reflectionHeight);
      for (const texture of [blurTexture, softReflection, reflection]) {
        gl!.bindTexture(gl!.TEXTURE_2D, texture);
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, reflectionWidth, reflectionHeight, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
      }
      gl!.bindRenderbuffer(gl!.RENDERBUFFER, reflectionDepth);
      gl!.renderbufferStorage(gl!.RENDERBUFFER, gl!.DEPTH_COMPONENT16, reflectionWidth, reflectionHeight);
    },
    pick(x: number, y: number, state: MotionState) {
      draw(state, true);
      gl!.readPixels(
        Math.min(canvas.width - 1, Math.max(0, Math.floor(x / viewportWidth * canvas.width))),
        Math.min(canvas.height - 1, Math.max(0, Math.floor((1 - y / viewportHeight) * canvas.height))),
        1,
        1,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        pixel
      );
      draw(state);
      return pixel[3] === 255 && pixel[0] > 0 && pixel[0] <= projects.length ? pixel[0] - 1 : -1;
    },
    destroy() {
      try {
        gl!.deleteBuffer(vertexBuffer);
        gl!.deleteBuffer(indexBuffer);
        gl!.deleteFramebuffer(reflectionBuffer);
        gl!.deleteFramebuffer(blurBuffer);
        gl!.deleteFramebuffer(softReflectionBuffer);
        gl!.deleteRenderbuffer(reflectionDepth);
        gl!.deleteTexture(reflection);
        gl!.deleteTexture(blurTexture);
        gl!.deleteTexture(softReflection);
        gl!.deleteProgram(program);
      } catch (e) {
        // ignore on unmount
      }
    }
  };
}

function createNoise(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, stencil: false });
  const fallback = (reason: any) => {
    canvas.style.backgroundImage = 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)';
    canvas.style.backgroundSize = "24px 24px";
    return { resize() {}, draw(_time: number) {}, destroy() {} };
  };
  if (!gl) return fallback("WebGL context was not available.");

  function compile(type: number, source: string) {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      const message = gl!.getShaderInfoLog(shader);
      gl!.deleteShader(shader);
      throw new Error(message || 'Noise shader compile error');
    }
    return shader;
  }

  let program: WebGLProgram | null = null;
  let vertex: WebGLShader | null = null;
  let fragment: WebGLShader | null = null;
  let buffer: WebGLBuffer | null = null;

  try {
    vertex = compile(gl.VERTEX_SHADER, `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `);
    fragment = compile(gl.FRAGMENT_SHADER, `
      precision highp float;
      uniform float frame;
      float random(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        vec2 pixel = gl_FragCoord.xy + vec2(mod(frame, 997.0) * 17.0, mod(frame, 991.0) * 31.0);
        float grain = (random(pixel) + random(pixel + 19.7)
          + random(pixel + 43.1) + random(pixel + 71.9)) * 0.25;
        gl_FragColor = vec4(vec3(grain), 1.0);
      }
    `);
    program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Noise program link failed');
  } catch (error) {
    if (program) gl.deleteProgram(program);
    return fallback(error);
  } finally {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
  }

  canvas.style.backgroundImage = "none";
  gl.useProgram(program);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const frame = gl.getUniformLocation(program, "frame");
  let previousFrame = -1;

  return {
    resize() {
      const ratio = 2;
      canvas.width = Math.round(document.documentElement.clientWidth * ratio);
      canvas.height = Math.round(document.documentElement.clientHeight * ratio);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      previousFrame = -1;
    },
    draw(time: number) {
      const currentFrame = Math.floor(time / 80);
      if (gl!.isContextLost() || currentFrame === previousFrame) return;
      previousFrame = currentFrame;
      gl!.uniform1f(frame, currentFrame);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    },
    destroy() {
      try {
        if (buffer) gl!.deleteBuffer(buffer);
        if (program) gl!.deleteProgram(program);
      } catch (e) {
        // ignore on unmount
      }
    }
  };
}

function layoutViewport(width: number, height: number) {
  const scale = height / 1080;
  return { scale, width: width / scale };
}

interface ShakuroRibbonGalleryProps {
  onProjectClick?: (project: RibbonProject) => void;
  className?: string;
  isBackgroundOnly?: boolean;
}

export const ShakuroRibbonGallery: React.FC<ShakuroRibbonGalleryProps> = ({
  onProjectClick,
  className = '',
  isBackgroundOnly = false,
}) => {
  const stageRef = useRef<HTMLElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const conveyorCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeProject, setActiveProject] = useState<RibbonProject | null>(null);
  const [hoveredProject, setHoveredProject] = useState<RibbonProject | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const noiseCanvas = noiseCanvasRef.current;
    const app = appRef.current;
    if (!stage || !noiseCanvas || !app) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Create conveyor canvas
    const canvas = document.createElement("canvas");
    canvas.className = "conveyor absolute inset-0 w-full h-full block";
    canvas.setAttribute("aria-hidden", "true");
    app.appendChild(canvas);
    conveyorCanvasRef.current = canvas;

    const motion: MotionState = {
      offset: 0,
      velocity: 0,
      pointerX: 0,
      pointerY: 0,
      parallaxX: 0,
      parallaxY: 0,
    };

    let conveyor: ReturnType<typeof createConveyor> | null = null;
    let previousTime = 0;
    let animationFrame = 0;
    let touch: { id: number; y: number; startX: number; startY: number } | null = null;
    let dragged = false;
    let noise = createNoise(noiseCanvas);

    function resize() {
      noise.resize();
      const { scale, width } = layoutViewport(window.innerWidth, window.innerHeight);
      if (stage) {
        stage.style.setProperty("--stage-scale", String(scale));
        stage.style.setProperty("--stage-width", `${width}px`);
      }
      conveyor?.resize(window.innerWidth, window.innerHeight);
    }

    function input(delta: number, touchInput = false) {
      if (!conveyor) return;
      const sensitivity = touchInput ? 0.00155 : 0.00019;
      if (reducedMotion.matches) {
        motion.offset = wrap(motion.offset + delta * sensitivity * 0.94 / 0.06, SHAKURO_PROJECTS.length);
      } else {
        motion.velocity += delta * sensitivity;
      }
      canvas.style.cursor = "";
    }

    function render(time: number) {
      const frames = previousTime ? Math.min((time - previousTime) / (1000 / 60), 3) : 1;
      previousTime = time;
      advanceMotion(motion, frames, SHAKURO_PROJECTS.length, reducedMotion.matches);
      noise.draw(reducedMotion.matches ? 0 : time);
      conveyor?.draw(motion);
      animationFrame = requestAnimationFrame(render);
    }

    const handleWheel = (event: WheelEvent) => {
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      input((Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * unit);
    };

    const handlePointerDown = (event: PointerEvent) => {
      dragged = false;
      if (!conveyor || event.pointerType === "mouse" || (event.target as HTMLElement).closest("a, button, input")) return;
      touch = { id: event.pointerId, y: event.clientY, startX: event.clientX, startY: event.clientY };
      try {
        app.setPointerCapture(event.pointerId);
      } catch (e) {
        // ignore
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (touch?.id === event.pointerId) {
        input(touch.y - event.clientY, true);
        touch.y = event.clientY;
        dragged = dragged || Math.hypot(touch.startX - event.clientX, touch.startY - event.clientY) > 6;
      } else if (event.pointerType === "mouse") {
        motion.pointerX = event.clientX / window.innerWidth * 2 - 1;
        motion.pointerY = event.clientY / window.innerHeight * 2 - 1;
        if (conveyor && Math.abs(motion.velocity) < 0.001) {
          const slot = conveyor.pick(event.clientX, event.clientY, motion);
          if (slot >= 0 && slot < SHAKURO_PROJECTS.length) {
            canvas.style.cursor = "pointer";
            setHoveredProject(SHAKURO_PROJECTS[slot]);
          } else {
            canvas.style.cursor = "";
            setHoveredProject(null);
          }
        }
      }
    };

    const handlePointerUp = () => { touch = null; };
    const handlePointerCancel = () => { touch = null; dragged = true; };
    const handleLostPointerCapture = () => { touch = null; };

    const handleClick = (event: MouseEvent) => {
      if (!conveyor || (event.target as HTMLElement).closest("a, button, input") || dragged) return;
      const slot = conveyor.pick(event.clientX, event.clientY, motion);
      if (slot >= 0 && slot < SHAKURO_PROJECTS.length) {
        const clicked = SHAKURO_PROJECTS[slot];
        setActiveProject(clicked);
        if (onProjectClick) {
          onProjectClick(clicked);
        } else {
          window.open(clicked.url, "_blank", "noopener,noreferrer");
        }
      }
    };

    const handlePointerLeave = () => {
      motion.pointerX = motion.pointerY = 0;
      canvas.style.cursor = "";
      setHoveredProject(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!conveyor || !["ArrowDown", "ArrowUp"].includes(event.key)) return;
      // Don't intercept when user is typing in an input
      if ((event.target as HTMLElement)?.tagName === 'INPUT') return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      if (reducedMotion.matches) {
        motion.offset = wrap(motion.offset + direction, SHAKURO_PROJECTS.length);
      } else {
        motion.velocity += direction * 0.06 / 0.94;
      }
    };

    const handleVisibilityChange = () => {
      cancelAnimationFrame(animationFrame);
      previousTime = 0;
      if (!document.hidden) animationFrame = requestAnimationFrame(render);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    app.addEventListener("pointerdown", handlePointerDown);
    app.addEventListener("pointermove", handlePointerMove);
    app.addEventListener("pointerup", handlePointerUp);
    app.addEventListener("pointercancel", handlePointerCancel);
    app.addEventListener("lostpointercapture", handleLostPointerCapture);
    app.addEventListener("click", handleClick);
    app.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", resize);

    // Load textures
    const images = SHAKURO_PROJECTS.map((proj) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = proj.image;
      return img;
    });

    const loadPromise = Promise.all(
      images.map(
        (img) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
          })
      )
    );

    loadPromise.then((textures) => {
      try {
        conveyor = createConveyor(canvas, textures, SHAKURO_PROJECTS);
        resize();
      } catch (err) {
        console.warn("WebGL Ribbon initialization error:", err);
      }
    });

    resize();
    animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      app.removeEventListener("pointerdown", handlePointerDown);
      app.removeEventListener("pointermove", handlePointerMove);
      app.removeEventListener("pointerup", handlePointerUp);
      app.removeEventListener("pointercancel", handlePointerCancel);
      app.removeEventListener("lostpointercapture", handleLostPointerCapture);
      app.removeEventListener("click", handleClick);
      app.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);

      conveyor?.destroy();
      noise.destroy();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [onProjectClick]);

  return (
    <div className={`shakuro-ribbon-container fixed inset-0 overflow-hidden bg-black select-none pointer-events-auto ${className}`}>
      {/* 3D WebGL Scaled Stage */}
      <main
        ref={stageRef}
        className="stage absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black"
        style={{
          width: 'var(--stage-width, 100vw)',
          height: '1080px',
          transform: 'translate(-50%, -50%) scale(var(--stage-scale, 1))',
          isolation: 'isolate',
        }}
        aria-label="Shakuro design gallery"
      >
        {/* Film grain noise canvas */}
        <canvas
          ref={noiseCanvasRef}
          className="noise absolute inset-0 w-full h-full pointer-events-none z-[9]"
          style={{
            opacity: 0.22,
            mixBlendMode: 'soft-light',
          }}
          aria-hidden="true"
        />

        {/* Ambient Top Glow Mask */}
        <div
          className="glow absolute pointer-events-none z-[8]"
          style={{
            left: 'calc(50% - 542.19px)',
            top: '-454.19px',
            width: '1068.38px',
            height: '1548.38px',
            background: 'radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.42) 0%, rgba(225, 29, 72, 0.12) 35%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom Ambient Floor Vignette */}
        <div
          className="bottom-shade absolute inset-0 z-[9] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.04) 55%, rgba(0, 0, 0, 0.12) 68%, rgba(0, 0, 0, 0.26) 80%, rgba(0, 0, 0, 0.46) 91%, rgba(0, 0, 0, 0.75) 100%)',
          }}
          aria-hidden="true"
        />
      </main>

      {/* Ribbon WebGL App Mount Viewport */}
      <div
        ref={appRef}
        id="app"
        role="region"
        aria-label="Scroll, swipe or use arrow keys to explore our work"
        className="fixed inset-0 z-[11] touch-none"
      />

      {/* Floating Hover Indicator when inspecting projects */}
      {hoveredProject && !isBackgroundOnly && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4 py-2 rounded-full bg-stone-900/90 border border-white/20 text-white shadow-2xl backdrop-blur-md flex items-center gap-2.5 transition-all animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-semibold tracking-wide">{hoveredProject.title}</span>
          <span className="text-[10px] font-mono text-stone-400">· Click to inspect</span>
        </div>
      )}
    </div>
  );
};

