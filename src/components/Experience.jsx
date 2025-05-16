import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import React, { forwardRef } from "react";

export const Experience = forwardRef(({ preguntas, onAudiosCompletados }, ref) => {
  const texture = useTexture("textures/class.png");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <OrbitControls />
      <Avatar 
        position={[0, -3, 4]} 
        scale={2} 
        preguntas={preguntas} 
        ref={ref} 
        onAudiosCompletados={onAudiosCompletados} 
      />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
});