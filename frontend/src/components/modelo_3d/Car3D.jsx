// import { useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";

// const Car = ({ color }) => {
//   const ref = useRef();

//   // Animación de rotación
//   useFrame(() => {
//     if (ref.current) ref.current.rotation.y += 0.005;
//   });

//   return (
//     <mesh ref={ref} position={[0, 0, 0]} scale={[1.5, 0.5, 3]}>
//       <boxGeometry args={[1, 0.5, 2]} />
//       <meshStandardMaterial color={color || "red"} />
//     </mesh>
//   );
// };

// const Car3D = ({ color }) => {
//   return (
//     <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />
//       <Car color={color} />
//       <OrbitControls enableZoom={true} />
//     </Canvas>
//   );
// };

// export default Car3D;
