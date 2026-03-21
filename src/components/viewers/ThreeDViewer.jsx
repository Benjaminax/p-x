import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeDViewer({ className = '', style = {}, showHighlight = false, highlightPosition = [0.5, 0.2, 1.0], highlightColor = 0xff6b6b }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Light
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    // Simple "brain-like" mesh (placeholder) - layered spheres
    const group = new THREE.Group();

    const mat1 = new THREE.MeshStandardMaterial({ color: 0xffefef, roughness: 0.6, metalness: 0 });
    const mat2 = new THREE.MeshStandardMaterial({ color: 0xffdede, roughness: 0.5, metalness: 0 });

    const geom1 = new THREE.SphereGeometry(1.6, 64, 64);
    const mesh1 = new THREE.Mesh(geom1, mat1);
    mesh1.scale.set(1, 0.95, 1);
    group.add(mesh1);

    const geom2 = new THREE.SphereGeometry(1.3, 64, 64);
    const mesh2 = new THREE.Mesh(geom2, mat2);
    mesh2.scale.set(1, 0.9, 0.95);
    group.add(mesh2);

    scene.add(group);

    // Optional highlight region (anomaly) — render ONLY when explicitly requested
    if (showHighlight) {
      const highlightMat = new THREE.MeshStandardMaterial({ color: highlightColor, emissive: highlightColor, emissiveIntensity: 0.3 });
      const highlight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), highlightMat);
      const [hx, hy, hz] = highlightPosition;
      highlight.position.set(hx, hy, hz);
      scene.add(highlight);
    }

    // Responsive
    const handleResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    let req;
    const animate = () => {
      req = requestAnimationFrame(animate);
      group.rotation.y += 0.0025;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(req);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-72 rounded-md overflow-hidden bg-transparent ${className}`} style={style} />;
}
