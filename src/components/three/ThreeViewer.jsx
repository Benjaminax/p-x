import React, { Suspense, useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'
import ControlsPanel from './ControlsPanel'

const BrainShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0ea5e9') },
        uHighlight: { value: new THREE.Color('#ef4444') },
        uPointSize: { value: 2.2 },
        uOpacity: { value: 0.8 },
        uNoiseFreq: { value: 0.012 },
        uNoiseAmp: { value: 2.8 },
        uBurbleUp: { value: 0.0 },
        uXray: { value: 0.0 }, // 0 or 1
        uThinking: { value: 0.0 }, // 0 or 1
    },
    vertexShader: `
        uniform float uTime;
        uniform float uPointSize;
        uniform float uNoiseFreq;
        uniform float uNoiseAmp;
        uniform float uBurbleUp;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDepth;
        varying float vNoise;
        
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 1.0/7.0;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vColor = color;
            vec3 pos = position;
            
            // Vertical Burble Displacement
            vec3 noisePos = pos * uNoiseFreq;
            noisePos.y -= uTime * uBurbleUp; 
            float noise = snoise(noisePos + uTime * 0.2);
            vNoise = noise;
            
            pos += normal * noise * uNoiseAmp;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vDepth = -mvPosition.z / 300.0;
            
            gl_PointSize = uPointSize * (1.0 + noise * 0.2);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uXray;
        uniform float uThinking;
        uniform float uTime;
        varying vec3 vColor;
        varying float vDepth;
        varying float vNoise;
        
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            // Thinking Pulse
            float pulse = 1.0;
            if (uThinking > 0.5) {
                pulse = 1.0 + 0.4 * sin(uTime * 4.0 + vDepth * 10.0);
            }
            
            float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * pulse;
            
            // Xray depth mode
            if (uXray > 0.5) {
                alpha *= (0.2 + 0.8 * vDepth);
            } else {
                alpha *= (1.0 - vDepth * 0.5);
            }
            
            vec3 finalColor = mix(uColor, vColor, 0.7);
            gl_FragColor = vec4(finalColor, alpha);
        }
    `
};

const LinkShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0ea5e9') },
        uOpacity: { value: 0.2 },
        uThinking: { value: 0.0 },
    },
    vertexShader: `
        uniform float uTime;
        varying float vOpacity;
        void main() {
            vec3 pos = position;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vOpacity = (1.0 / (-mvPosition.z / 100.0)) * 0.5;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uOpacity;
        uniform float uThinking;
        varying float vOpacity;
        void main() {
            float freq = uThinking > 0.5 ? 6.0 : 2.0;
            float pulse = 0.5 + 0.5 * sin(uTime * freq);
            gl_FragColor = vec4(uColor, uOpacity * vOpacity * pulse * 2.5);
        }
    `
};

const FilamentShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0ea5e9') },
    },
    vertexShader: `
        uniform float uTime;
        varying float vAlpha;
        void main() {
            vec3 pos = position;
            float pulse = sin(uTime * 2.0 + pos.x * 0.05) * 0.5 + 0.5;
            vAlpha = pulse;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
            gl_FragColor = vec4(uColor, vAlpha * 0.15);
        }
    `
};

function NeuralFilaments() {
    const linesRef = useRef();

    const geometry = useMemo(() => {
        const lines = [];
        for (let i = 0; i < 15; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600,
                (Math.random() - 0.5) * 600
            );

            // Create a curved path
            const mid = start.clone().lerp(end, 0.5);
            mid.x += (Math.random() - 0.5) * 200;
            mid.y += (Math.random() - 0.5) * 200;
            mid.z += (Math.random() - 0.5) * 200;

            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            lines.push(...curve.getPoints(20));
        }
        return new THREE.BufferGeometry().setFromPoints(lines);
    }, []);

    useFrame(({ clock }) => {
        if (linesRef.current) {
            linesRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
            linesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <line ref={linesRef} geometry={geometry}>
            <shaderMaterial
                attach="material"
                args={[FilamentShader]}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </line>
    );
}

const BubbleShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0ea5e9') },
    },
    vertexShader: `
        uniform float uTime;
        attribute vec3 color;
        varying float vAlpha;
        void main() {
            vec3 pos = position;
            float life = fract(uTime * 0.1 + color.r);
            pos.y += life * 150.0;
            pos.x += sin(uTime + color.g * 10.0) * 10.0;
            pos.z += cos(uTime + color.b * 10.0) * 10.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vAlpha = 1.0 - life;
            gl_PointSize = (10.0 * (1.0 - life)) * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float glow = smoothstep(0.5, 0.0, dist);
            gl_FragColor = vec4(uColor, vAlpha * glow * 0.5);
        }
    `
};

function NeuralBubbles({ count = 40 }) {
    const pointsRef = useRef();

    const [geo] = useState(() => {
        const g = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = -100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
            col[i * 3] = Math.random();     // random life offset
            col[i * 3 + 1] = Math.random(); // random x wobble
            col[i * 3 + 2] = Math.random(); // random z wobble
        }
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        return g;
    });

    useFrame(({ clock }) => {
        if (pointsRef.current) {
            pointsRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <points ref={pointsRef} geometry={geo}>
            <shaderMaterial
                attach="material"
                args={[BubbleShader]}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function NeuralCables() {
    const curves = useMemo(() => {
        const c = [];
        const anchors = [
            [600, 400, -200], [-600, 400, -200],
            [600, -400, -200], [-600, -400, -200],
            [0, 600, -200], [0, -600, -200]
        ];
        anchors.forEach(pos => {
            const start = new THREE.Vector3(...pos);
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            const mid = new THREE.Vector3(pos[0] * 0.5, pos[1] * 0.5, -300);
            c.push(new THREE.QuadraticBezierCurve3(start, mid, end));
        });
        return c;
    }, []);

    return (
        <group>
            {curves.map((curve, i) => (
                <mesh key={i}>
                    <tubeGeometry args={[curve, 40, 0.5, 8, false]} />
                    <meshBasicMaterial
                        color="#0ea5e9"
                        transparent
                        opacity={0.08}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

function NeuralFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -110, 0]}>
            <planeGeometry args={[1000, 1000]} />
            <meshBasicMaterial
                color="#0ea5e9"
                transparent
                opacity={0.03}
                side={THREE.DoubleSide}
            />
            <gridHelper args={[1000, 50, "#0ea5e9", "#0ea5e9"]} position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial attach="material" transparent opacity={0.05} />
            </gridHelper>
        </mesh>
    );
}

function NeuralLinks({ obj, playing, thinking }) {
    const linesRef = useRef()
    const shaderRef = useRef()

    const geometry = useMemo(() => {
        if (!obj) return null
        const geometries = []
        obj.traverse((child) => {
            if (child.isMesh && child.geometry) {
                geometries.push(child.geometry)
            }
        })
        if (geometries.length === 0) return null

        const merged = new THREE.BufferGeometry()
        let total = 0
        geometries.forEach(g => total += g.attributes.position.count)
        const pos = new Float32Array(total * 3)
        let offset = 0
        geometries.forEach(g => {
            pos.set(g.attributes.position.array, offset)
            offset += g.attributes.position.count * 3
        })
        merged.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        return new THREE.WireframeGeometry(merged)
    }, [obj])

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0ea5e9') },
        uOpacity: { value: 0.2 },
        uThinking: { value: thinking ? 1.0 : 0.0 },
    }), [thinking])

    useEffect(() => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.uThinking.value = thinking ? 1.0 : 0.0;
        }
    }, [thinking]);

    useFrame(({ clock }) => {
        if (!linesRef.current) return
        const time = clock.getElapsedTime()
        if (playing) linesRef.current.rotation.y = time * 0.12
        if (shaderRef.current) shaderRef.current.uniforms.uTime.value = time
        const s = 1 + Math.sin(time * 1.2) * 0.012
        linesRef.current.scale.set(s, s, s)
    })

    if (!geometry) return null

    return (
        <lineSegments ref={linesRef} geometry={geometry}>
            <shaderMaterial
                ref={shaderRef}
                attach="material"
                args={[LinkShader]}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    )
}

function BrainParticles({ obj, playing, pointSize, diagnosisArea, bodyPart, xray, thinking, burbleUp, severity = 'normal', tumorFocus }) {
    const pointsRef = useRef()
    const shaderRef = useRef()
    const highlightRef = useRef()
    const highlightShaderRef = useRef()
    const [geometry, setGeometry] = useState(null)
    const [highlightGeometry, setHighlightGeometry] = useState(null)

    const regionZones = useMemo(() => ({
        'Frontal Lobe': { x: [20, 150], y: [-150, 150], z: [0, 150] },
        'Parietal Lobe': { x: [-150, 20], y: [20, 150], z: [-50, 50] },
        'Temporal Lobe': { x: [-100, 100], y: [-150, 0], z: [-50, 50] },
        'Occipital Lobe': { x: [-150, -20], y: [-100, 100], z: [-150, 50] },
        'Cerebellum': { x: [-100, 100], y: [-150, -50], z: [-100, -20] },
        'Brain Stem': { x: [-20, 20], y: [-200, -100], z: [-20, 20] },
        'Left Parahippocampal Gyrus': { x: [-80, -20], y: [-100, -40], z: [-40, 40] },
        'Right Parahippocampal Gyrus': { x: [20, 80], y: [-100, -40], z: [-40, 40] },
        'Middle Cerebral Artery': { x: [-60, 60], y: [-20, 40], z: [-20, 20] },
        'Sagittal Sinus': { x: [-10, 10], y: [100, 150], z: [-100, 100] }
    }), [])

    const tumorMarkerPosition = useMemo(() => {
        if (!tumorFocus || !tumorFocus.present || !bodyPart || !regionZones[bodyPart]) return null
        const zone = regionZones[bodyPart]
        const nx = Number(tumorFocus?.centroid_norm?.x)
        const ny = Number(tumorFocus?.centroid_norm?.y)
        if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null

        const x = zone.x[0] + nx * (zone.x[1] - zone.x[0])
        const y = zone.y[1] - ny * (zone.y[1] - zone.y[0])
        const z = zone.z[0] + 0.6 * (zone.z[1] - zone.z[0])
        return [x, y, z]
    }, [tumorFocus, bodyPart, regionZones])

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#0ea5e9') },
        uHighlight: { value: new THREE.Color('#ef4444') },
        uPointSize: { value: pointSize },
        uOpacity: { value: 0.85 },
        uNoiseFreq: { value: 0.012 },
        uNoiseAmp: { value: 2.8 },
        uBurbleUp: { value: burbleUp },
        uXray: { value: 1.0 },
        uThinking: { value: thinking ? 1.0 : 0.0 },
    }), [pointSize])

    useEffect(() => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.uXray.value = xray ? 1.0 : 0.0;
            shaderRef.current.uniforms.uThinking.value = thinking ? 1.0 : 0.0;
            shaderRef.current.uniforms.uBurbleUp.value = burbleUp;
        }
    }, [xray, thinking, burbleUp]);

    useEffect(() => {
        if (!obj) return

        // Explicit: if diagnosisArea indicates 'no tumor' or 'normal', never produce highlight geometry
        const isNoTumor = diagnosisArea && (String(diagnosisArea).toLowerCase().includes('no') || String(diagnosisArea).toLowerCase().includes('normal') || String(diagnosisArea).toLowerCase().includes('no_tumor'))

        // Do not build region highlights for low/normal severity — highlights are reserved for medium/high
        const severityIsSignificant = (severity === 'high' || severity === 'medium')

        const geometries = []
        obj.traverse((child) => {
            if (child.isMesh && child.geometry) geometries.push(child.geometry)
        })
        if (geometries.length === 0) return

        const mergedGeometry = new THREE.BufferGeometry()
        let totalVertices = 0
        geometries.forEach(g => totalVertices += g.attributes.position.count)
        const positions = new Float32Array(totalVertices * 3)
        const normals = new Float32Array(totalVertices * 3)
        let offset = 0
        geometries.forEach(g => {
            positions.set(g.attributes.position.array, offset)
            if (g.attributes.normal) normals.set(g.attributes.normal.array, offset)
            offset += g.attributes.position.count * 3
        })
        const geometry = mergedGeometry
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))

        const count = totalVertices
        const colorArray = new Float32Array(count * 3)
        for (let i = 0; i < count * 3; i += 3) {
            colorArray[i] = 0.05; colorArray[i + 1] = 0.65; colorArray[i + 2] = 0.91
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
        setGeometry(geometry)

        // Build a separate geometry that contains ONLY the points inside the requested bodyPart zone
        // Only create highlight geometry when severity is medium/high AND diagnosis is not 'no_tumor'
        if (bodyPart && severityIsSignificant && !isNoTumor) {
            const zone = regionZones[bodyPart]
            if (zone) {
                const highlightPos = []
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i], y = positions[i + 1], z = positions[i + 2]
                    const inZone = x >= (zone.x?.[0] ?? -999) && x <= (zone.x?.[1] ?? 999) && y >= (zone.y?.[0] ?? -999) && y <= (zone.y?.[1] ?? 999) && z >= (zone.z?.[0] ?? -999) && z <= (zone.z?.[1] ?? 999)
                    if (inZone) {
                        highlightPos.push(x, y, z)
                    }
                }
                if (highlightPos.length > 0) {
                    const hg = new THREE.BufferGeometry()
                    hg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(highlightPos), 3))
                    const highlightColorArray = new Float32Array((highlightPos.length / 3) * 3)
                    // fill with neutral but shader will tint
                    for (let i = 0; i < highlightColorArray.length; i += 3) {
                        highlightColorArray[i] = 0.05; highlightColorArray[i + 1] = 0.65; highlightColorArray[i + 2] = 0.91
                    }
                    hg.setAttribute('color', new THREE.BufferAttribute(highlightColorArray, 3))
                    setHighlightGeometry(hg)
                } else {
                    setHighlightGeometry(null)
                }
            } else {
                setHighlightGeometry(null)
            }
        } else {
            setHighlightGeometry(null)
        }
    }, [obj, bodyPart, severity, diagnosisArea])

    useEffect(() => {
        if (!geometry) return
        const positions = geometry.attributes.position.array
        const colorArray = geometry.attributes.color.array
        // If diagnosis explicitly indicates no tumor, force normal coloring and skip highlights
        const isNoTumor = diagnosisArea && (String(diagnosisArea).toLowerCase().includes('no') || String(diagnosisArea).toLowerCase().includes('normal') || String(diagnosisArea).toLowerCase().includes('no_tumor'))
        if (isNoTumor) {
            for (let i = 0; i < colorArray.length; i += 3) {
                colorArray[i] = 0.05; colorArray[i + 1] = 0.65; colorArray[i + 2] = 0.91
            }
            geometry.attributes.color.needsUpdate = true
            return
        }

        // Prefer the passed `severity` prop; only 'high' and 'medium' should produce visible highlights.
        const effectiveSeverity = (severity === 'high' || severity === 'medium')
            ? severity
            : (() => {
                let s = 'normal'
                if (diagnosisArea) {
                    const diag = diagnosisArea.toLowerCase()
                    // Only recognise the four DESIGN training labels
                    if (diag.includes('pituitary')) s = 'medium'
                    else if (diag.includes('glioma') || diag.includes('meningioma') || diag.includes('tumor') || diag.includes('glioblastoma') || diag.includes('hgg')) s = 'high'
                    else s = 'normal'
                }
                return s
            })()
        const highlight = { high: { r: 1, g: 0.1, b: 0.1 }, medium: { r: 1, g: 0.6, b: 0 }, normal: { r: 0.05, g: 0.65, b: 0.91 } }[effectiveSeverity]

        if (bodyPart && regionZones[bodyPart]) {
            const zone = regionZones[bodyPart]
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i], y = positions[i + 1], z = positions[i + 2]
                let inZone = x >= (zone.x?.[0] ?? -999) && x <= (zone.x?.[1] ?? 999) && y >= (zone.y?.[0] ?? -999) && y <= (zone.y?.[1] ?? 999) && z >= (zone.z?.[0] ?? -999) && z <= (zone.z?.[1] ?? 999)
                if (inZone) {
                    colorArray[i] = highlight.r; colorArray[i + 1] = highlight.g; colorArray[i + 2] = highlight.b
                } else {
                    colorArray[i] = 0.05; colorArray[i + 1] = 0.65; colorArray[i + 2] = 0.91
                }
            }
        } else {
            for (let i = 0; i < colorArray.length; i += 3) {
                colorArray[i] = 0.05; colorArray[i + 1] = 0.65; colorArray[i + 2] = 0.91
            }
        }
        geometry.attributes.color.needsUpdate = true
    }, [geometry, diagnosisArea, bodyPart, regionZones, severity])

    useFrame(({ clock }) => {
        if (!pointsRef.current) return
        const time = clock.getElapsedTime()
        if (playing) pointsRef.current.rotation.y = time * 0.12
        if (shaderRef.current) shaderRef.current.uniforms.uTime.value = time
        const s = 1 + Math.sin(time * 1.2) * 0.012
        pointsRef.current.scale.set(s, s, s)

        // animate highlight layer if present (pulse when severe)
        if (highlightRef.current && highlightShaderRef.current) {
            highlightShaderRef.current.uniforms.uTime.value = time
            const pulse = severity === 'high' ? (1.0 + 0.25 * Math.abs(Math.sin(time * 3.0))) : 1.0
            const base = pointSize * (severity === 'high' ? 2.6 : 2.0)
            highlightShaderRef.current.uniforms.uPointSize.value = base * pulse
        }
    })

    if (!geometry) return null

    return (
        <>
            <points ref={pointsRef}>
                <primitive object={geometry} attach="geometry" />
                <shaderMaterial
                    ref={shaderRef}
                    attach="material"
                    args={[BrainShader]}
                    uniforms={uniforms}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Highlight layer (subset of points for the selected brain region) */}
            {highlightGeometry && (
                <points ref={highlightRef} geometry={highlightGeometry}>
                    <primitive object={highlightGeometry} attach="geometry" />
                    <shaderMaterial
                        ref={highlightShaderRef}
                        attach="material"
                        args={[BrainShader]}
                        uniforms={{
                            uTime: { value: 0 },
                            uColor: { value: new THREE.Color('#ef4444') },
                            uPointSize: { value: pointSize * (severity === 'high' ? 2.6 : 2.0) },
                            uOpacity: { value: severity === 'high' ? 1.0 : 0.95 },
                            uNoiseFreq: { value: 0.0 },
                            uNoiseAmp: { value: 0.0 },
                            uBurbleUp: { value: 0.0 },
                            uXray: { value: 0.0 },
                            uThinking: { value: 0.0 }
                        }}
                        transparent={true}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </points>
            )}

            {/* Specific tumor marker derived from MRI centroid in selected region */}
            {tumorMarkerPosition && (
                <group position={tumorMarkerPosition}>
                    <mesh>
                        <sphereGeometry args={[4.5, 16, 16]} />
                        <meshBasicMaterial
                            color={'#ef4444'}
                            transparent
                            opacity={0.95}
                        />
                    </mesh>
                    <mesh>
                        <ringGeometry args={[6.5, 8.2, 24]} />
                        <meshBasicMaterial color={'#ef4444'} transparent opacity={0.55} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            )}
        </>
    )
}

function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-4 bg-black/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-teal-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-teal-500 animate-spin"></div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">Neural Core</span>
                    <span className="text-xs font-bold text-zinc-400">Initializing Synapses...</span>
                </div>
            </div>
        </Html>
    )
}

export default function ThreeViewer({ diagnosisArea, bodyPart, severity = 'normal', tumorFocus, showControls = true }) {
    const obj = useLoader(OBJLoader, "/static/models/brain-parts-big.obj")
    const [playing, setPlaying] = useState(true)
    const [pointSize, setPointSize] = useState(1.7)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showXray, setShowXray] = useState(true)
    const [thinking, setThinking] = useState(false)
    const [burbleUp, setBurbleUp] = useState(0.1)
    const containerRef = useRef()

    const toggleFullscreen = useCallback(async () => {
        if (!containerRef.current) return
        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen()
                setIsFullscreen(true)
            } else {
                await document.exitFullscreen()
                setIsFullscreen(false)
            }
        } catch (err) {
            console.error('Fullscreen Error:', err)
        }
    }, [])

    const handleReset = useCallback(() => {
        setPlaying(true)
        setPointSize(1.7)
        setShowXray(true)
        setThinking(false)
        setBurbleUp(0.1)
    }, [])

    return (
        <div ref={containerRef} role="region" aria-label="3D brain viewer" className="relative w-full h-full min-h-[42vh] sm:min-h-[48vh] md:min-h-[56vh] bg-[#1a1a1a] overflow-hidden">
            <Canvas camera={{ position: [0, 100, 480], fov: 35 }}>
                <color attach="background" args={['#1a1a1a']} />
                <fog attach="fog" args={['#1a1a1a', 100, 1200]} />
                <ambientLight intensity={1.0} />
                <pointLight position={[50, 50, 50]} intensity={3.0} color="#0ea5e9" />
                <pointLight position={[-50, -50, -50]} intensity={2.0} color="#0284c7" />
                <Suspense fallback={<Loader />}>
                    <group position={[0, 10, 0]}>
                        <BrainParticles
                            obj={obj}
                            playing={playing}
                            pointSize={pointSize}
                            diagnosisArea={diagnosisArea}
                            bodyPart={bodyPart}
                            xray={showXray}
                            thinking={thinking}
                            burbleUp={burbleUp}
                            severity={severity}
                            tumorFocus={tumorFocus}
                        />
                        <NeuralLinks obj={obj} playing={playing} thinking={thinking} />
                        <NeuralFilaments />
                        <NeuralCables />
                    </group>
                    <NeuralBubbles count={50} />
                    <NeuralFloor />
                </Suspense>
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    minDistance={100}
                    maxDistance={1200}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            {showControls && (
                <ControlsPanel
                    playing={playing}
                    setPlaying={setPlaying}
                    pointSize={pointSize}
                    setPointSize={setPointSize}
                    isFullscreen={isFullscreen}
                    toggleFullscreen={toggleFullscreen}
                    showXray={showXray}
                    setShowXray={setShowXray}
                    thinking={thinking}
                    setThinking={setThinking}
                    burbleUp={burbleUp}
                    setBurbleUp={setBurbleUp}
                    onReset={handleReset}
                />
            )}

            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
        </div>
    )
}
