"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { VRMLoaderPlugin, VRM, VRMUtils } from "@pixiv/three-vrm";
import type { GLTF } from "three/addons/loaders/GLTFLoader.js";
import {
  Mesh,
  Material,
  BufferGeometry,
  Group,
  AnimationMixer,
  AnimationClip,
  Clock,
  LoopRepeat,
} from "three";

const ANIMATIONS = [
  "https://hologramxyz.s3.amazonaws.com/assets/animations/idle/idle1.fbx",
  "https://hologramxyz.s3.amazonaws.com/animations/holo/HOLO-dance.fbx",
  "https://hologramxyz.s3.amazonaws.com/assets/animations/idle/idle2.fbx",
  "https://hologramxyz.s3.amazonaws.com/animations/holo/HOLO-thinking.fbx",
  "https://hologramxyz.s3.amazonaws.com/assets/animations/idle/idle4.fbx",
  "https://hologramxyz.s3.amazonaws.com/animations/holo/HOLO-excited.fbx",
  "https://hologramxyz.s3.amazonaws.com/assets/animations/idle/idle6.fbx",
];

const BONE_MAP: Record<string, string> = {
  mixamorigHips: "Hips",
  mixamorigSpine: "Spine",
  mixamorigSpine1: "Spine1",
  mixamorigSpine2: "Spine2",
  mixamorigNeck: "Neck",
  mixamorigHead: "Head",
  mixamorigLeftShoulder: "LeftShoulder",
  mixamorigLeftArm: "LeftArm",
  mixamorigLeftForeArm: "LeftForeArm",
  mixamorigLeftHand: "LeftHand",
  mixamorigRightShoulder: "RightShoulder",
  mixamorigRightArm: "RightArm",
  mixamorigRightForeArm: "RightForeArm",
  mixamorigRightHand: "RightHand",
  mixamorigLeftUpLeg: "LeftUpLeg",
  mixamorigLeftLeg: "LeftLeg",
  mixamorigLeftFoot: "LeftFoot",
  mixamorigLeftToeBase: "LeftToeBase",
  mixamorigRightUpLeg: "RightUpLeg",
  mixamorigRightLeg: "RightLeg",
  mixamorigRightFoot: "RightFoot",
  mixamorigRightToeBase: "RightToeBase",
};

function retargetAnimation(clip: AnimationClip): AnimationClip {
  // Filter out tracks that don't have corresponding VRM bones
  const validTracks = clip.tracks.filter((track) => {
    const [boneName] = track.name.split(".");
    return BONE_MAP[boneName];
  });

  // Retarget the valid tracks
  const tracks = validTracks.map((track) => {
    const [boneName, ...propertyParts] = track.name.split(".");
    const vrmBoneName = BONE_MAP[boneName];

    const newTrack = track.clone();
    newTrack.name = `${vrmBoneName}.${propertyParts.join(".")}`;
    return newTrack;
  });

  const retargetedClip = new AnimationClip(clip.name, clip.duration, tracks);
  return retargetedClip;
}

interface AnimationContextType {
  currentClip: AnimationClip | null;
  setCurrentClip: (clip: AnimationClip) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  currentClip: null,
  setCurrentClip: () => {},
});

function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [currentClip, setCurrentClip] = useState<AnimationClip | null>(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const animationsRef = useRef<AnimationClip[]>([]);

  useEffect(() => {
    const fbxLoader = new FBXLoader();
    let loadedCount = 0;

    ANIMATIONS.forEach((animUrl, index) => {
      fbxLoader.load(
        animUrl,
        (fbx) => {
          if (fbx.animations.length > 0) {
            const clip = fbx.animations[0];
            clip.name = `animation_${index}`;
            const retargetedClip = retargetAnimation(clip);
            animationsRef.current[index] = retargetedClip;
            loadedCount++;

            if (loadedCount === ANIMATIONS.length) {
              setCurrentClip(animationsRef.current[0]);
            }
          }
        },
        undefined,
        (error) => console.error(`Error loading animation ${animUrl}:`, error)
      );
    });
  }, []);

  useEffect(() => {
    if (currentClip) {
      const duration = currentClip.duration;
      const timer = setTimeout(() => {
        const nextIndex = (animationIndex + 1) % ANIMATIONS.length;
        setAnimationIndex(nextIndex);
        setCurrentClip(animationsRef.current[nextIndex]);
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentClip, animationIndex]);

  return (
    <AnimationContext.Provider value={{ currentClip, setCurrentClip }}>
      {children}
    </AnimationContext.Provider>
  );
}

interface VRMModelProps {
  url: string;
  position?: [number, number, number];
}

function VRMModel({ url, position = [0, 0, 0] }: VRMModelProps) {
  const vrmRef = useRef<VRM>();
  const sceneRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer>();
  const clockRef = useRef(new Clock());
  const { currentClip } = useContext(AnimationContext);

  useEffect(() => {
    if (currentClip && vrmRef.current) {
      if (!mixerRef.current) {
        mixerRef.current = new AnimationMixer(vrmRef.current.scene);
      }

      mixerRef.current.stopAllAction();
      const action = mixerRef.current.clipAction(currentClip);
      VRMUtils.rotateVRM0(vrmRef.current);
      action.setEffectiveTimeScale(0.6); // Slow down the animation a bit
      action.setLoop(LoopRepeat, Infinity); // Loop the animation indefinitely
      action.clampWhenFinished = false; // Don't clamp at the end
      action.play();
    }
  }, [currentClip]);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      url,
      (gltf: GLTF) => {
        const vrm = gltf.userData.vrm;
        vrmRef.current = vrm;
        if (sceneRef.current) {
          while (sceneRef.current.children.length) {
            sceneRef.current.remove(sceneRef.current.children[0]);
          }
          sceneRef.current.add(vrm.scene);
          vrm.scene.rotation.y = Math.PI;
          vrm.scene.position.set(...position);

          if (currentClip) {
            mixerRef.current = new AnimationMixer(vrm.scene);
            const action = mixerRef.current.clipAction(currentClip);
            VRMUtils.rotateVRM0(vrm);
            action.play();
          }
        }
      },
      (progress: { loaded: number; total: number }) =>
        console.log(`Loading model ${url}...`, progress),
      (error: unknown) => console.error(`Error loading ${url}:`, error)
    );

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (vrmRef.current) {
        vrmRef.current.scene.traverse((obj) => {
          const mesh = obj as Mesh;
          if (mesh.material) {
            (Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material]
            ).forEach((material: Material) => {
              material.dispose();
            });
          }
          if (mesh.geometry) {
            (mesh.geometry as BufferGeometry).dispose();
          }
        });
      }
    };
  }, [url, position, currentClip]);

  useFrame(() => {
    if (mixerRef.current) {
      const delta = clockRef.current.getDelta();
      mixerRef.current.update(delta);
    }
    if (vrmRef.current) {
      vrmRef.current.update(clockRef.current.getDelta());
    }
  });

  return <group ref={sceneRef} />;
}

export default function VRMViewer({ modelUrls }: { modelUrls: string[] }) {
  return (
    <div className="h-[400px] relative rounded-lg overflow-hidden bg-[#2a2a2a] shadow-lg">
      <Canvas
        camera={{
          fov: 35,
          near: 0.1,
          far: 1000,
          position: [0, 1.2, 2.5],
        }}
      >
        <AnimationProvider>
          <color attach="background" args={["#2a2a2a"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[1, 2, 2]} intensity={1} />
          {modelUrls.map((url) => (
            <VRMModel key={url} url={url} position={[0, -0.8, 0]} />
          ))}
          <OrbitControls
            minDistance={1.5}
            maxDistance={4}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0.5, 0]}
          />
        </AnimationProvider>
      </Canvas>
    </div>
  );
}
