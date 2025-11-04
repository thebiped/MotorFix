// import { useState, Suspense } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
// import "./SetupCar.css";

// const carModels = {
//   Ferrari: [
//     { name: "488 GTB", path: "/models/ferrari_488.glb", colors: ["#FF0000", "#000000", "#FFFFFF", "#808080", "#0000FF"] }
//   ],
//   Lamborghini: [
//     { name: "Huracan", path: "/models/lamborghini_huracan.glb", colors: ["#FF0000", "#000000", "#FFFFFF", "#808080", "#FFFF00"] },
//     { name: "Aventador", path: "/models/lamborghini_aventador.glb", colors: ["#FF0000", "#000000", "#FFFFFF", "#808080", "#00FF00"] }
//   ],
//   Porsche: [
//     { name: "911 GT3", path: "/models/porsche_911.glb", colors: ["#FF0000", "#000000", "#FFFFFF", "#808080", "#0000FF"] },
//     { name: "Taycan", path: "/models/porsche_taycan.glb", colors: ["#FF0000", "#000000", "#FFFFFF", "#808080", "#00FFFF"] }
//   ]
// };

// const Car = ({ modelPath, color }) => {
//   const { scene } = useGLTF(modelPath);
//   scene.traverse((child) => {
//     if (child.isMesh && child.material) {
//       child.material.color.set(color);
//     }
//   });
//   return <primitive object={scene} scale={0.7} position={[0, -0.5, 0]} />;
// };

// const SetupCar = () => {
//   const [selectedBrand, setSelectedBrand] = useState("Ferrari");
//   const [selectedModelIndex, setSelectedModelIndex] = useState(0);
//   const [selectedColor, setSelectedColor] = useState(carModels[selectedBrand][0].colors[0]);

//   const models = carModels[selectedBrand];
//   const selectedModel = models[selectedModelIndex];

//   return (
//     <div className="setup-container">
//       <div className="car-viewer">
//         <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[5, 5, 5]} intensity={1} />
//           <Suspense fallback={null}>
//             <Car modelPath={selectedModel.path} color={selectedColor} />
//             <Environment preset="city" />
//           </Suspense>
//           <OrbitControls enablePan={false} />
//         </Canvas>
//       </div>

//       <div className="car-controls">
//         <div className="control-group">
//           <label>Marca:</label>
//           <select value={selectedBrand} onChange={(e) => {
//             setSelectedBrand(e.target.value);
//             setSelectedModelIndex(0);
//             setSelectedColor(carModels[e.target.value][0].colors[0]);
//           }}>
//             {Object.keys(carModels).map((brand) => (
//               <option key={brand} value={brand}>{brand}</option>
//             ))}
//           </select>
//         </div>

//         <div className="control-group">
//           <label>Modelo:</label>
//           <select value={selectedModelIndex} onChange={(e) => {
//             setSelectedModelIndex(Number(e.target.value));
//             setSelectedColor(models[e.target.value].colors[0]);
//           }}>
//             {models.map((model, index) => (
//               <option key={model.name} value={index}>{model.name}</option>
//             ))}
//           </select>
//         </div>

//         <div className="control-group colors">
//           <label>Color:</label>
//           <div className="color-palette">
//             {selectedModel.colors.map((color) => (
//               <button
//                 key={color}
//                 className="color-button"
//                 style={{ backgroundColor: color }}
//                 onClick={() => setSelectedColor(color)}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SetupCar;
