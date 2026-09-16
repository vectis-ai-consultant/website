'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { logoMark } from '@/lib/logo'
import { ballState, orbitState, leverState, smooth } from '@/lib/ball-state'

// Improved Perlin noise, on the CPU, exactly as the source scene uses it: the
// shell is a real displaced mesh rather than a shader trick, which is what gives
// the ball its slow breathing silhouette.
const P = new Uint8Array(512)
;(() => {
  const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
  for (let i = 0; i < 512; i++) P[i] = p[i & 255]
})()
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (t: number, a: number, b: number) => a + t * (b - a)
function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}
function noise(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
  const u = fade(x), v = fade(y), w = fade(z)
  const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z
  const B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z
  return lerp(w,
    lerp(v, lerp(u, grad(P[AA], x, y, z), grad(P[BA], x - 1, y, z)),
            lerp(u, grad(P[AB], x, y - 1, z), grad(P[BB], x - 1, y - 1, z))),
    lerp(v, lerp(u, grad(P[AA + 1], x, y, z - 1), grad(P[BA + 1], x - 1, y, z - 1)),
            lerp(u, grad(P[AB + 1], x, y - 1, z - 1), grad(P[BB + 1], x - 1, y - 1, z - 1))))
}
const displace = (x: number, y: number, z: number, t: number) =>
  noise(x * 1.5 + t * 0.22, y * 1.5, z * 1.5 + t * 0.16) * 0.14 +
  noise(x * 3.2, y * 3.2 + t * 0.3, z * 3.2 + 5) * 0.045


// --- the tools the leverage is built out of -------------------------------
// Same eight marks the old site's leverage scene used, in the same 4/3/1
// pyramid. OpenAI, Instagram, TikTok, Shopify and Slack are self-hosted:
// simpleicons dropped some of them on trademark request, and a mark drawn into
// a canvas used as a WebGL texture has to be CORS-clean or the texture taints.
type Fg = string | [string, string]
const TOOLS: [string, string, Fg][] = [
  ['OpenAI', 'file:/assets/logos/tools/openai.svg', '#0f0f0f'],
  ['Claude', 'claude', '#d97757'],
  ['Gemini', 'googlegemini', ['#4e8cf7', '#d96570']],
  ['n8n', 'n8n', '#ea4b71'],
  ['Instagram', 'file:/assets/logos/tools/instagram-color.svg', '#e4405f'],
  ['TikTok', 'file:/assets/logos/tools/tiktok-color.svg', '#111111'],
  ['Shopify', 'file:/assets/logos/tools/shopify-color.svg', '#7ab55c'],
  ['Slack', 'file:/assets/logos/tools/slack-color.svg', '#4a154b'],
]
// 4 / 3 / 1, each row centred on x = -3.6, tiles 0.95 apart, in rig units.
const TOOL_SLOTS: [number, number][] = [
  [-5.03, 0], [-4.08, 0], [-3.13, 0], [-2.18, 0],
  [-4.55, 1], [-3.60, 1], [-2.65, 1],
  [-3.60, 2],
]
// The leverage is built in the old scene's units and then shrunk into the
// ball's frame as one rig, so none of its proportions had to be re-derived.
const RIG = 0.33, RIG_Y = -0.53, PIVOT = 3.02

const mix = (a: number, b: number, t: number) => a + (b - a) * t

export default function StoryScene(
  { storyId, act1Id, act2Id, act3Id }:
  { storyId: string; act1Id: string; act2Id: string; act3Id: string },
) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    const story = document.getElementById(storyId)
    const act1 = document.getElementById(act1Id)
    const act2 = document.getElementById(act2Id)
    const act3 = document.getElementById(act3Id)
    if (!el || !story || !act1 || !act2 || !act3) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const light = innerWidth < 900
    const seg = light ? 40 : 72
    const DOTS = light ? 1400 : 3200

    const renderer = new THREE.WebGLRenderer({ antialias: !light, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 60)
    const ball = new THREE.Group()
    scene.add(ball)

    scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb8ee, 0.9))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(-3, 4, 5)
    scene.add(key)
    const warm = new THREE.PointLight(0xffb48a, 26, 12, 2)
    scene.add(warm)
    const cool = new THREE.PointLight(0x4f8ff5, 18, 12, 2)
    cool.position.set(0.5, -2.6, 1.5)
    scene.add(cool)

    const geo = new THREE.SphereGeometry(1.02, seg, seg)
    const base = geo.attributes.position.array.slice() as Float32Array
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, opacity: 0.16,
      roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08,
      sheen: 1, sheenColor: new THREE.Color(0xffd7c2), sheenRoughness: 0.4,
      // A thin film, which is what this is: the colour that runs round the shell
      // comes from the thickness of the wall rather than from a tint, so it moves
      // with the view the way it does on a bubble.
      iridescence: 0.7, iridescenceIOR: 1.3, iridescenceThicknessRange: [120, 380],
      depthWrite: false, side: THREE.FrontSide,
    })

    // The room the shell reflects.
    //
    // `clearcoat` and `sheen` above are reflection terms, and until now there was
    // no environment in the scene at all — so they had nothing to reflect and the
    // shell was carried entirely by three analytic lights on a 16% surface, which
    // is a painted decal rather than glass. This is built out of the page's own
    // palette instead of a stock studio: a room the ball is actually standing in
    // reads as real, a room it was photographed in somewhere else does not. The
    // window sits where the analytic key already sits, so the specular highlight
    // and the reflected one agree instead of arguing.
    const envScene = new THREE.Scene()
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(10, 24, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: `varying vec3 vP;
          void main(){ vP = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vP;
          void main(){ float h = normalize(vP).y * 0.5 + 0.5;
            vec3 c = mix(vec3(0.16,0.20,0.44), vec3(0.88,0.92,1.0), smoothstep(0.1,0.8,h));
            gl_FragColor = vec4(c,1.0); }`,
      }),
    ))
    // Values past 1 are the point: the render target is half-float, so these stay
    // bright through the blur and give the shell a highlight with a core.
    const panel = (c: THREE.Color, w: number, h: number, at: THREE.Vector3) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c }))
      m.position.copy(at)
      m.lookAt(0, 0, 0)
      envScene.add(m)
    }
    panel(new THREE.Color(5, 5, 5.4), 6, 8, new THREE.Vector3(-3, 4, 5).multiplyScalar(1.1))
    panel(new THREE.Color(1.6, 1.05, 0.72), 7, 4, new THREE.Vector3(3.6, -4, 2))
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envRT = pmrem.fromScene(envScene, 0.06)
    pmrem.dispose()
    // The shell alone, not scene.environment: that would relight the rocket, the
    // mark and the tool tiles as well, which is not what was asked for. The
    // intensity is high because opacity scales the reflections down with
    // everything else on the surface.
    shellMat.envMap = envRT.texture
    shellMat.envMapIntensity = 3.2

    const shell = new THREE.Mesh(geo, shellMat)
    ball.add(shell)

    // Shared by the rim and the dots: add light, but leave the canvas alpha
    // alone — the context is premultiplied, so a high alpha with a modest
    // colour composites black.
    const additive = {
      transparent: true, blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
      depthWrite: false,
    } as const

    const rimMat = new THREE.ShaderMaterial({
      ...additive,
      uniforms: { uFade: { value: 1 } },
      vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; uniform float uFade;
        void main(){ float f = pow(1.0 - max(dot(vN,vV),0.0), 3.0);
          vec3 c = mix(vec3(0.55,0.75,1.0), vec3(1.0,0.86,0.74), smoothstep(0.2,0.9,f));
          gl_FragColor = vec4(c * f * 0.5 * uFade, 1.0); }`,
    })
    const rim = new THREE.Mesh(new THREE.SphereGeometry(1.03, seg, seg), rimMat)
    ball.add(rim)

    // Three positions per dot, worked out once: where it sits on the shell,
    // where it flies to when the ball breaks, and where it lands in the volume
    // of the beam. Everything in between is a lerp of those, so the burst is a
    // pure function of scroll and replays backwards exactly.
    const pos = new Float32Array(DOTS * 3), size = new Float32Array(DOTS)
    const sphere = new Float32Array(DOTS * 3)
    const burst = new Float32Array(DOTS * 3)
    const beam = new Float32Array(DOTS * 3)
    const seed = new Float32Array(DOTS)
    const golden = Math.PI * (3 - Math.sqrt(5))
    const HALF = 6.5 * RIG, BEAM_Y = (PIVOT + 0.12) * RIG + RIG_Y
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), th = golden * i
      const rad = 1.06 + Math.random() * 0.26
      const x0 = Math.cos(th) * r * rad, y0 = y * rad, z0 = Math.sin(th) * r * rad
      sphere[i * 3] = pos[i * 3] = x0
      sphere[i * 3 + 1] = pos[i * 3 + 1] = y0
      sphere[i * 3 + 2] = pos[i * 3 + 2] = z0
      // Kept inside the frame: a wider throw just empties the screen.
      const out = 1.55 + Math.random() * 1.25
      burst[i * 3] = x0 * out + (Math.random() - 0.5) * 0.7
      burst[i * 3 + 1] = y0 * out + (Math.random() - 0.5) * 0.7
      burst[i * 3 + 2] = z0 * out + (Math.random() - 0.5) * 0.7
      beam[i * 3] = (Math.random() * 2 - 1) * HALF
      beam[i * 3 + 1] = BEAM_Y + (Math.random() * 2 - 1) * 0.12 * RIG * 3
      beam[i * 3 + 2] = (Math.random() * 2 - 1) * 0.65 * RIG
      size[i] = 2 + Math.random() * 4
      seed[i] = Math.random()
    }
    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    dotGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    const dotMat = new THREE.ShaderMaterial({
      ...additive,
      uniforms: { uScale: { value: 1 }, uFade: { value: 1 } },
      vertexShader: `attribute float aSize; uniform float uScale; varying float vA;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
          // Clamped so the dots do not blow out when the camera dives in close.
          gl_PointSize = min(aSize * uScale * (3.6 / -mv.z), 9.0);
          vA = smoothstep(0.0, 1.0, 1.0 - (-mv.z - 2.0) / 6.0);
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying float vA; uniform float uFade;
        void main(){ float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          gl_FragColor = vec4(vec3(0.62,0.78,1.0), (1.0 - d * 2.0) * 0.55 * vA * uFade); }`,
    })
    const dots = new THREE.Points(dotGeo, dotMat)
    ball.add(dots)

    // The shell's dots are additive, which is right inside a glowing ball and
    // useless outside it: on a pale page, adding light can only wash out. So
    // the break-up gets its own pass over the same points — ordinary alpha, in
    // ink — and the two cross-fade as the ball comes apart.
    const shardMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uFade: { value: 0 } },
      vertexShader: `attribute float aSize; varying float vD;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = clamp(aSize * (7.0 / -mv.z), 2.0, 16.0);
          vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying float vD; uniform float uFade;
        void main(){ float d = length(gl_PointCoord - 0.5);
          if(d > 0.5) discard;
          gl_FragColor = vec4(vec3(0.20,0.27,0.62), smoothstep(0.5,0.32,d) * uFade); }`,
    })
    const shards = new THREE.Points(dotGeo, shardMat)
    shards.visible = false
    ball.add(shards)

    // --- the mark: a serif V -------------------------------------------------
    // Drawn as an outline rather than loaded as a font, so there is no typeface
    // to ship and no loader to wait on. Apex at the bottom, arms up to y = 3,
    // thick left stroke and thin right one, bracketed serifs across the top.
    // Turned 180° it is the fulcrum: the serifs become its feet and the apex
    // becomes the flat that meets the beam. Centred on its own middle, so the
    // turn reads as a tumble rather than a swing.
    // Extruded from the wordmark's own outline rather than a drawn glyph, so the
    // mark inside the ball — and the fulcrum it turns into — is literally the logo.
    const paths = new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136 47"><path d="${logoMark}"/></svg>`,
    ).paths
    const markGeo = new THREE.ExtrudeGeometry(
      paths.flatMap(p => p.toShapes(true)), { depth: 6, bevelEnabled: false },
    )
    // SVG's y axis points down. Rotating by pi about x corrects it while keeping
    // the winding order intact — scaling by -1 would flip every face normal.
    markGeo.rotateX(Math.PI)
    markGeo.computeBoundingBox()
    const bb = markGeo.boundingBox!
    const fit = 3 / (bb.max.y - bb.min.y)
    markGeo.scale(fit, fit, fit)
    // Centred so the flip turns about the glyph's middle, not its corner.
    markGeo.center()
    const markMat = new THREE.MeshStandardMaterial({
      // Near-black and almost fully rough, so the extrusion reads as one solid
      // silhouette instead of lit rods — the letterform the old site stands on
      // the ground. Any sheen and the decorative lights inside the ball put a
      // bronze edge down one leg of it.
      color: 0x131210, roughness: 0.95, metalness: 0, transparent: true, opacity: 0,
    })
    const mark = new THREE.Mesh(markGeo, markMat)
    mark.visible = false
    scene.add(mark)

    // --- the leverage, in the old scene's units, shrunk as one rig ----------
    const rig = new THREE.Group()
    rig.scale.setScalar(RIG)
    rig.position.y = RIG_Y
    scene.add(rig)
    const lever = new THREE.Group()
    lever.position.y = PIVOT
    rig.add(lever)
    const plankMat = new THREE.MeshStandardMaterial({
      color: 0xdbe3f4, roughness: 0.32, metalness: 0.14, transparent: true, opacity: 0,
    })
    const plank = new THREE.Mesh(new THREE.BoxGeometry(13, 0.34, 1.3), plankMat)
    plank.position.y = 0.12
    plank.visible = false
    lever.add(plank)

    // rocket — stays upright and rides the far end of the beam
    const rocket = new THREE.Group()
    rocket.visible = false
    rig.add(rocket)
    // The old rocket was white on a warm page; here the page is pale blue, so
    // the nose and fins take the brand blue or it disappears into the sky.
    const white = new THREE.MeshStandardMaterial({ color: 0xf4f7ff, roughness: 0.4, metalness: 0.1 })
    const blue = new THREE.MeshStandardMaterial({ color: 0x3a4fae, roughness: 0.32, metalness: 0.2 })
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 1.7, 32), white); body.position.y = 1.15; rocket.add(body)
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 32), blue); nose.position.y = 2.42; rocket.add(nose)
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.32, 24), new THREE.MeshStandardMaterial({ color: 0x8e9ab8, roughness: 0.5 })); nozzle.position.y = 0.16; rocket.add(nozzle)
    for (let i = 0; i < 3; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.55), blue)
      const a = (i * Math.PI * 2) / 3 + Math.PI / 2
      fin.position.set(Math.cos(a) * 0.62, 0.62, Math.sin(a) * 0.62); fin.rotation.y = -a; rocket.add(fin)
    }
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.4, 24),
      new THREE.MeshBasicMaterial({ color: 0xffa93a, transparent: true, opacity: 0.95 }))
    flame.rotation.x = Math.PI; flame.position.y = -0.7; flame.visible = false; rocket.add(flame)
    const glow = new THREE.PointLight(0xffa93a, 0, 8); glow.position.y = -0.4; rocket.add(glow)

    // --- the tool tiles -----------------------------------------------------
    const tileGeo = (() => {
      const W = 0.48, H = 0.48, R = 0.19
      const s = new THREE.Shape()
      s.moveTo(-W + R, -H); s.lineTo(W - R, -H); s.quadraticCurveTo(W, -H, W, -H + R)
      s.lineTo(W, H - R); s.quadraticCurveTo(W, H, W - R, H)
      s.lineTo(-W + R, H); s.quadraticCurveTo(-W, H, -W, H - R)
      s.lineTo(-W, -H + R); s.quadraticCurveTo(-W, -H, -W + R, -H)
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.17, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 14 })
      g.translate(0, 0, -0.085)
      const uv = g.attributes.uv, p = g.attributes.position
      for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) + 0.5, p.getY(i) + 0.5)
      return g
    })()
    const textures: THREE.CanvasTexture[] = []
    const makeTexture = (name: string, src: string, fg: Fg) => {
      const c = document.createElement('canvas'); c.width = c.height = 256
      const ctx = c.getContext('2d')!
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
      textures.push(tex)
      const paint = (target: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
        if (Array.isArray(fg)) { const g = target.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, fg[0]); g.addColorStop(1, fg[1]); target.fillStyle = g }
        else target.fillStyle = fg
      }
      const draw = (img: HTMLImageElement | null) => {
        ctx.clearRect(0, 0, 256, 256)
        // The old tiles were a warm off-white; here the fall-off is cool, to
        // sit in the same blue family as the rest of the page.
        const face = ctx.createLinearGradient(0, 0, 70, 256)
        face.addColorStop(0, '#ffffff'); face.addColorStop(0.62, '#ffffff'); face.addColorStop(1, '#e8eefb')
        ctx.fillStyle = face; ctx.fillRect(0, 0, 256, 256)
        const sheen = ctx.createLinearGradient(0, 0, 0, 150)
        sheen.addColorStop(0, 'rgba(255,255,255,.85)'); sheen.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = sheen; ctx.fillRect(0, 0, 256, 150)
        const X = 46, S = 164
        if (img && Array.isArray(fg) && !src.startsWith('file:')) {
          // Tint on an offscreen canvas — source-in here would erase the face.
          const o = document.createElement('canvas'); o.width = o.height = 256
          const octx = o.getContext('2d')!
          octx.drawImage(img, X, X, S, S)
          octx.globalCompositeOperation = 'source-in'
          paint(octx, X, X, S, S); octx.fillRect(0, 0, 256, 256)
          ctx.drawImage(o, 0, 0)
        } else if (img) {
          ctx.drawImage(img, X, X, S, S)
        } else {
          paint(ctx, X, X, S, S)
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          let px = 52
          const font = (n: number) => `700 ${n}px "Helvetica Neue", Helvetica, Arial, sans-serif`
          ctx.font = font(px)
          while (ctx.measureText(name).width > 176 && px > 20) { px -= 2; ctx.font = font(px) }
          ctx.fillText(name, 128, 132)
        }
        tex.needsUpdate = true
      }
      draw(null)
      const img = new Image(); img.crossOrigin = 'anonymous'
      img.onload = () => { draw(img); repaint() }
      img.src = src.startsWith('file:') ? src.slice(5)
        : `https://cdn.simpleicons.org/${src}/${Array.isArray(fg) ? '000000' : fg.slice(1)}`
      return tex
    }
    // The tiles hang off the lever, so the beam's tilt carries them for free.
    const tiles = TOOLS.map(([name, src, fg]) => {
      const face = new THREE.MeshBasicMaterial({ map: makeTexture(name, src, fg), toneMapped: false, transparent: true, opacity: 0 })
      const edge = new THREE.MeshStandardMaterial({ color: 0xf2f5fd, roughness: 0.4, metalness: 0.02, transparent: true, opacity: 0 })
      const m = new THREE.Mesh(tileGeo, [face, edge])
      m.visible = false
      lever.add(m)
      return m
    })
    const setTileFade = (m: THREE.Mesh, v: number) => {
      const mats = m.material as THREE.Material[]
      mats[0].opacity = v; mats[1].opacity = v
      m.visible = v > 0.01
    }

    // Resizing the drawing buffer CLEARS it, so this only fires when the pixel
    // size genuinely changed, and it is called from inside draw() — resize and
    // render land in the same frame, and a cleared buffer is never presented.
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      if (!w || !h) return
      const dpr = Math.min(devicePixelRatio, 2)
      const cw = Math.round(w * dpr), ch = Math.round(h * dpr)
      const c = renderer.domElement
      if (c.width === cw && c.height === ch) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    // How far through a pinned section we are: 0 as it locks, 1 as it releases.
    // How far a section has travelled, 0 at its top, 1 when it is done. The
    // usual denominator is the section minus a viewport, which finishes the act
    // while the last screenful is still going past — fine when there is copy to
    // read in that window, dead air when there is not. `full` measures against
    // the whole section instead, so the act ends exactly where the next begins.
    const run = (sec: HTMLElement, full = false) => {
      const box = sec.getBoundingClientRect()
      return -box.top / Math.max(1, full ? box.height : box.height - innerHeight)
    }

    // One pass per scroll frame. Everything the three acts need is derived here
    // from three positions, so the whole story is reversible by construction.
    const state = { shatter: 0, gather: 0, solid: 0, spin: 0, ring: 0 }
    const place = () => {
      // The phone shows six of the twelve (the rest are display:none), so it runs a
      // six-voice schedule — otherwise the last one lands a third of the way in and
      // the rest of the pinned act is dead scroll. Matches leverState's `tiles`.
      const s1 = ballState(run(act1), innerWidth < 900 ? 6 : 12)
      const s2 = orbitState(run(act2, true))
      const p3 = run(act3)
      const s3 = leverState(p3)
      // Past the third act the story is told, but the scene is now the page's
      // whole background. The machine bows out over the next third of a screen
      // and leaves its dust behind, so the sections below read on a quiet field
      // instead of over a lever. Position-derived like everything else, so it
      // comes back exactly on the way up.
      const tail = Math.min(1, Math.max(0, (p3 - 1) / 0.22))
      const off = 1 - tail

      // The framing is tuned for a wide screen. On a narrower one the same
      // distance would push the ball past the edges, so back the camera off.
      const fit = Math.min(1.9, Math.max(1, 1.45 / camera.aspect))
      // The beam is more than four units wide, so unlike the ball it cannot be
      // framed by backing off a fixed amount: a phone needs whatever distance
      // actually fits it. Worked out from the aspect, it is a no-op at 16:10.
      const tanHalf = Math.tan((camera.fov * Math.PI) / 360)
      const far = Math.max(5.6, 2.5 / (tanHalf * camera.aspect))
      // In to 2.9 for the caption, back out to 3.6 as the caption leaves, and then
      // held there for the whole of the deck — `ease` completes at 0.32, where the
      // track starts. Across the horizontal scroll every term feeding this is
      // constant, so the shell neither moves nor changes size while the cards run.
      // Out to 6.0 for the ring once the deck is gone.
      const radius = mix(mix(mix(mix(s1.radius, 2.9, s2.close), 3.6, s2.ease), 6.0, s2.frame) * fit, far, s3.pull) * (1 + 0.45 * tail)
      const polar = mix(mix(s1.polar, 1.46, s2.frame), 1.4, s3.pull)
      // Act 2 looks below the ball so it rides above its own caption. Act 3 puts
      // its caption at the top instead, so it aims above the machine, which
      // drops the whole rig into the lower two thirds of the frame — the beam
      // needs the room, and the tiles used to land on top of the words. Measured
      // off the act's own camera distance rather than fixed: a phone watches the
      // beam from much further back, where a world-space offset covers far less
      // of the frame, and the band the caption needs is the same either way.
      // Act two holds its aim dead centre for the whole of the deck run. It used
      // to lift to -0.34 over `ease` to clear the cards at the foot, and that lift
      // was the one thing making the shell travel while the deck slid across it:
      // two moves at once, and the sideways one is the one being read. `radius`
      // still opens out over the same window, so the room for the cards comes from
      // the shell getting smaller in place rather than from it riding up. The
      // camera only leaves the centre for `frame`, once the deck is gone and the
      // ring of tools needs the room — and that is deliberately not scaled by
      // `fit` the way act three's is: on a phone that much lift pushes the mark up
      // into act one's `.hero-bleed`, which is still painting over the top of this
      // act, and the V gets cut off by it.
      const lookY = mix(mix(0, -0.5, s2.frame), far * 0.164, s3.pull)
      camera.position.set(0, radius * Math.cos(polar), radius * Math.sin(polar))
      // The rings are sized off the second act's own framing, so they hold
      // still while the third act dollies the camera back.
      const ringFit = Math.min(1, (6.0 * fit * tanHalf * camera.aspect) / 2.85)

      // Wide: the ball steps right and the copy takes the left half. Narrow:
      // there is no left half, so it lifts and the copy sits underneath. Either
      // way the second act brings it back to the middle.
      const narrow = camera.aspect < 0.95
      const aside = s1.aside * (1 - s2.centre)
      // Wide screens now make room for the problems by ringing them around the
      // shell, so the ball holds the centre instead of sliding out of it. A phone
      // has no room beside it either way and still lifts it to clear the cards.
      ball.position.x = 0
      ball.position.y = narrow ? aside * 1.15 * fit : 0
      camera.lookAt(ball.position.x * 0.55 * (1 - s3.pull), ball.position.y * 0.5 + lookY, 0)

      // --- the mark: inside the ball from the dive on, then the fulcrum -----
      const markOn = Math.max(s1.mark, s2.mark)
      markMat.opacity = markOn * off
      mark.visible = markOn * off > 0.01
      mark.scale.setScalar(mix(0.3, RIG, s3.flip))
      mark.rotation.z = Math.PI * s3.flip
      // The camera starts overhead, and an extruded glyph seen from above is all
      // serif tops and no letter. So while it is only a mark it stays face-on to
      // the camera, tipping upright exactly as the camera comes level; from the
      // flip on it is a fulcrum standing on the ground and holds its own angle.
      // and the reveal tips it over the horizontal on the way in. Not a turn in
      // the plane — the mark starts apex-up and tumbles toward the camera, legs
      // swinging up and over, so it arrives as a solid thing in space rather
      // than a flat shape spinning. It rides markOn, so the moment the mark is
      // fully there it is a normal V.
      mark.rotation.x = (polar - Math.PI / 2) * (1 - s3.flip) - Math.PI * (1 - markOn)
      // It rides with the ball while it is inside it, and only takes its own
      // place on the ground once it has turned over.
      mark.position.x = ball.position.x * (1 - s3.flip)
      mark.position.y = mix(ball.position.y, RIG_Y + 1.5 * RIG, s3.flip)

      // --- 03 · the beam ----------------------------------------------------
      plank.visible = s3.solid * off > 0.01
      plankMat.opacity = s3.solid * off
      lever.rotation.z = s3.tilt * 0.22
      shellMat.opacity = 0.16 * (1 - s3.shatter)
      shell.visible = s3.shatter < 1
      rimMat.uniforms.uFade.value = 1 - s3.shatter
      rim.visible = s3.shatter < 1
      dotMat.uniforms.uScale.value = 1 + s3.shatter * 0.8
      // The dust is what stays: it comes back up as the beam goes, and holds a
      // whisper of itself behind every section below.
      dotMat.uniforms.uFade.value = (1 - s3.shatter * 0.8) * (1 - s3.solid) + 0.2 * tail
      const shardFade = s3.shatter * (1 - s3.solid) * 0.6
      shardMat.uniforms.uFade.value = shardFade
      shards.visible = shardFade > 0.01

      // Tools: they circle the mark, then fly to the pyramid on the short arm.
      for (let i = 0; i < tiles.length; i++) {
        const m = tiles[i]
        const land = s3.tiles[i]
        // Two counter-turning rings in the screen plane. A flat horizontal
        // orbit would be edge-on to this camera and read as a line, so the ring
        // is squashed into an ellipse and carries a little depth instead.
        const ringIx = i % 2
        const R = (ringIx ? 2.46 : 1.72) * ringFit
        const a = (i / tiles.length) * Math.PI * 2 + s2.spin * (ringIx ? -0.7 : 1)
        // The orbit is a world-space circle; the tiles live on the lever, so
        // express it in the lever's frame (which is level until they land).
        const wx = Math.cos(a) * R, wy = Math.sin(a) * R * 0.56, wz = Math.sin(a) * 0.85
        const ox = wx / RIG, oy = (wy - RIG_Y) / RIG - PIVOT, oz = wz / RIG
        const [sx, row] = TOOL_SLOTS[i]
        m.position.set(mix(ox, sx, land), mix(oy, 0.72 + row, land), mix(oz, 0, land))
        // Face the viewer while orbiting; lie flush with the beam once landed.
        m.rotation.set(0, Math.atan2(camera.position.x - wx, camera.position.z - wz) * (1 - land), 0)
        m.scale.setScalar(mix(1.25, 1, land))
        setTileFade(m, Math.max(s2.ring, land) * off)
      }

      // Rocket: upright, riding the far end of the beam, then gone.
      const on = Math.min(s3.solid, 1) * off
      rocket.visible = on > 0.01
      rocket.scale.setScalar(on)
      const a = lever.rotation.z
      rocket.position.set(Math.cos(a) * 5.4, PIVOT + Math.sin(a) * 5.4 + 0.24 + s3.launch * 16, 0)
      flame.visible = s3.launch > 0.02
      glow.intensity = s3.launch * 9

      state.shatter = s3.shatter; state.gather = s3.gather; state.solid = s3.solid

      // Faded out is not gone: without this the hero's links stay clickable and
      // tabbable underneath the rest of the story.
      const copy = act1.querySelector('.ball-copy')
      if (copy) {
        const gone = s1.hero < 0.05
        copy.toggleAttribute('data-gone', gone)
        copy.setAttribute('aria-hidden', String(gone))
      }
      story.style.setProperty('--frame', String(s1.frame))
      story.style.setProperty('--hero', String(s1.hero))
      // also on the root: the top bar lives outside .story now
      document.documentElement.style.setProperty('--hero', String(s1.hero))
      story.style.setProperty('--leverage', String(s1.leverage))
      s1.problems.forEach((v, i) => story.style.setProperty('--p' + (i + 1), String(v)))
      s1.exit.forEach((v, i) => story.style.setProperty('--e' + (i + 1), String(v)))
      story.style.setProperty('--exit-head', String(s1.headExit))
      story.style.setProperty('--flare', String(s1.flare))
      story.style.setProperty('--orbit', String(s2.copy))
      // The deck: one number for where the track is, four for how much of the
      // frame each card has. The track offset is worked out in CSS from --deck
      // and the card width, so nothing here needs to know how wide a card is at
      // this viewport.
      story.style.setProperty('--deck', String(s2.deck))
      story.style.setProperty('--deck-in', String(s2.deckIn))
      s2.cards.forEach((v, i) => story.style.setProperty('--sys-' + (i + 1), String(v)))
      s3.copy.forEach((v, i) => story.style.setProperty('--lever-' + (i + 1), String(v)))
    }

    const attr = geo.attributes.position as THREE.BufferAttribute
    const dotAttr = dotGeo.attributes.position as THREE.BufferAttribute
    let lastT = 0, scattered = false
    const draw = (t: number) => {
      lastT = t
      resize()
      const spin = t * 0.06
      // Once the shell is gone there is nothing to displace, and this loop plus
      // computeVertexNormals is the whole CPU cost of the scene.
      if (state.shatter < 1) {
        for (let i = 0; i < base.length; i += 3) {
          const x = base[i], y = base[i + 1], z = base[i + 2]
          const k = 1 + displace(x, y, z, t)
          attr.array[i] = x * k; attr.array[i + 1] = y * k; attr.array[i + 2] = z * k
        }
        attr.needsUpdate = true
        geo.computeVertexNormals()
        rim.rotation.y = shell.rotation.y = t * 0.03
      }
      if (state.shatter > 0 || state.gather > 0) {
        // Break-up and re-gather are written per dot. The spin is folded into
        // the shell term, which loses all its weight as the ball comes apart,
        // so the cloud stops turning without the angle ever jumping.
        dots.rotation.y = 0
        scattered = true
        const c = Math.cos(spin), s = Math.sin(spin)
        const arr = dotAttr.array as Float32Array
        for (let i = 0; i < DOTS; i++) {
          const j = i * 3
          const bx = sphere[j], by = sphere[j + 1], bz = sphere[j + 2]
          const sx = bx * c - bz * s, sz = bx * s + bz * c
          // Staggered by a per-dot seed, so the shell tears rather than pops.
          const h = seed[i]
          const f = smooth((state.shatter - h * 0.3) / 0.7)
          const g = smooth((state.gather - (1 - h) * 0.26) / 0.74)
          arr[j] = mix(mix(sx, burst[j], f), beam[j], g)
          arr[j + 1] = mix(mix(by, burst[j + 1], f), beam[j + 1], g)
          arr[j + 2] = mix(mix(sz, burst[j + 2], f), beam[j + 2], g)
        }
        dotAttr.needsUpdate = true
      } else {
        // Scrolling back out of the burst hands the spin back to the group, so
        // the buffer has to go back to the plain shell first — otherwise the
        // baked-in rotation and the group's rotation add up and every dot jumps
        // once, by however long the page has been open.
        if (scattered) {
          scattered = false
          ;(dotAttr.array as Float32Array).set(sphere)
          dotAttr.needsUpdate = true
        }
        dots.rotation.y = spin
      }
      warm.position.set(Math.cos(t * 0.5) * 2.4, 1.6 + Math.sin(t * 0.4) * 0.8, Math.sin(t * 0.5) * 2.4)
      renderer.render(scene, camera)
    }

    resize(); place(); draw(0)

    let frame = 0, visible = false, start = performance.now()
    // When the loop is parked (hidden, or reduced motion) nothing else will
    // repaint, so a layout change has to redraw the single static frame itself.
    function repaint() { if (!frame) draw(lastT) }
    const loop = () => {
      frame = requestAnimationFrame(loop)
      draw((performance.now() - start) / 1000)
    }
    const tick = () => {
      const go = visible && !document.hidden && !still
      if (go && !frame) { start = performance.now() - 1000; loop() }
      if (!go && frame) { cancelAnimationFrame(frame); frame = 0 }
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; tick() })
    io.observe(story)

    let pending = 0
    const onScroll = () => { if (!pending) pending = requestAnimationFrame(() => { pending = 0; place(); repaint() }) }
    const onResize = () => { place(); repaint() }
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onResize)
    const ro = new ResizeObserver(() => { place(); repaint() })
    ro.observe(el)
    document.addEventListener('visibilitychange', tick)

    return () => {
      io.disconnect(); ro.disconnect()
      cancelAnimationFrame(frame); cancelAnimationFrame(pending)
      removeEventListener('scroll', onScroll); removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', tick)
      textures.forEach((t) => t.dispose())
      envRT.dispose()
      renderer.dispose(); geo.dispose(); dotGeo.dispose(); markGeo.dispose(); tileGeo.dispose()
      shardMat.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [storyId, act1Id, act2Id, act3Id])

  return <div ref={host} className="ball-canvas" aria-hidden="true" />
}
