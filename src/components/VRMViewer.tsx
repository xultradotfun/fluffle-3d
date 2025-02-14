"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
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
  // Additional bones for attachments
  mixamorigChest: "Chest",
  mixamorigUpperChest: "UpperChest",
  mixamorigLeftHandThumb1: "LeftHandThumb1",
  mixamorigLeftHandThumb2: "LeftHandThumb2",
  mixamorigLeftHandThumb3: "LeftHandThumb3",
  mixamorigLeftHandIndex1: "LeftHandIndex1",
  mixamorigLeftHandIndex2: "LeftHandIndex2",
  mixamorigLeftHandIndex3: "LeftHandIndex3",
  mixamorigLeftHandMiddle1: "LeftHandMiddle1",
  mixamorigLeftHandMiddle2: "LeftHandMiddle2",
  mixamorigLeftHandMiddle3: "LeftHandMiddle3",
  mixamorigRightHandThumb1: "RightHandThumb1",
  mixamorigRightHandThumb2: "RightHandThumb2",
  mixamorigRightHandThumb3: "RightHandThumb3",
  mixamorigRightHandIndex1: "RightHandIndex1",
  mixamorigRightHandIndex2: "RightHandIndex2",
  mixamorigRightHandIndex3: "RightHandIndex3",
  mixamorigRightHandMiddle1: "RightHandMiddle1",
  mixamorigRightHandMiddle2: "RightHandMiddle2",
  mixamorigRightHandMiddle3: "RightHandMiddle3",
};

// Add animation cache at the top with other constants
const animationCache = new Map<string, AnimationClip>();

function retargetAnimation(clip: AnimationClip): AnimationClip {
  // Don't filter out tracks, instead try to map all of them
  const tracks = clip.tracks.map((track) => {
    const [boneName, ...propertyParts] = track.name.split(".");
    const vrmBoneName = BONE_MAP[boneName];

    // If we have a mapping, use it. Otherwise keep the original name
    // This ensures we don't lose any animation tracks
    const newTrack = track.clone();
    if (vrmBoneName) {
      newTrack.name = `${vrmBoneName}.${propertyParts.join(".")}`;
    }
    return newTrack;
  });

  const retargetedClip = new AnimationClip(clip.name, clip.duration, tracks);
  return retargetedClip;
}

interface AnimationContextType {
  currentClip: AnimationClip | null;
  setCurrentClip: (clip: AnimationClip) => void;
  isLoadingAnimations: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  currentClip: null,
  setCurrentClip: () => {},
  isLoadingAnimations: true,
});

function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [currentClip, setCurrentClip] = useState<AnimationClip | null>(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isLoadingAnimations, setIsLoadingAnimations] = useState(true);
  const animationsRef = useRef<AnimationClip[]>([]);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const loadAnimations = async () => {
      setIsLoadingAnimations(true);
      const fbxLoader = new FBXLoader();
      let loadedCount = 0;

      try {
        await Promise.all(
          ANIMATIONS.map((animUrl, index) => {
            // Check cache first
            const cachedAnimation = animationCache.get(animUrl);
            if (cachedAnimation) {
              animationsRef.current[index] = cachedAnimation;
              loadedCount++;
              if (loadedCount === ANIMATIONS.length) {
                setCurrentClip(animationsRef.current[0]);
                setIsLoadingAnimations(false);
              }
              return Promise.resolve();
            }

            // Load if not cached
            return new Promise<void>((resolve, reject) => {
              fbxLoader.load(
                animUrl,
                (fbx) => {
                  if (fbx.animations.length > 0) {
                    const clip = fbx.animations[0];
                    clip.name = `animation_${index}`;
                    const retargetedClip = retargetAnimation(clip);

                    // Cache the animation
                    animationCache.set(animUrl, retargetedClip);
                    animationsRef.current[index] = retargetedClip;

                    loadedCount++;
                    if (loadedCount === ANIMATIONS.length) {
                      setCurrentClip(animationsRef.current[0]);
                      setIsLoadingAnimations(false);
                    }
                  }
                  resolve();
                },
                undefined,
                (error) => {
                  console.error(`Error loading animation ${animUrl}:`, error);
                  reject(error);
                }
              );
            });
          })
        );
      } catch (error) {
        console.error("Error loading animations:", error);
        setIsLoadingAnimations(false);
      }
    };

    loadAnimations();

    return () => {
      loadingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (currentClip && !isLoadingAnimations) {
      const duration = currentClip.duration;
      const timer = setTimeout(() => {
        const nextIndex = (animationIndex + 1) % ANIMATIONS.length;
        setAnimationIndex(nextIndex);
        setCurrentClip(animationsRef.current[nextIndex]);
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentClip, animationIndex, isLoadingAnimations]);

  return (
    <AnimationContext.Provider
      value={{ currentClip, setCurrentClip, isLoadingAnimations }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

// Modify the model cache to include progress callbacks
interface CacheEntry {
  promise: Promise<VRM>;
  progress: number;
}

const modelCache = new Map<string, CacheEntry>();

interface VRMModelProps {
  url: string;
  position?: [number, number, number];
  onLoaded?: () => void;
  onProgress?: (progress: number) => void;
  isComplete?: boolean;
}

function VRMModel({
  url,
  position = [0, 0, 0],
  onLoaded,
  onProgress,
  isComplete,
}: VRMModelProps) {
  const vrmRef = useRef<VRM>();
  const sceneRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer>();
  const clockRef = useRef(new Clock());
  const { currentClip, isLoadingAnimations } = useContext(AnimationContext);
  const hasInitialized = useRef(false);

  // Animation and VRM update effect
  useEffect(() => {
    if (currentClip && vrmRef.current && isComplete && !isLoadingAnimations) {
      // Ensure VRM is properly initialized
      VRMUtils.rotateVRM0(vrmRef.current);

      // Reset the mixer to ensure clean state
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(vrmRef.current.scene);
      }

      // Create new mixer on the root scene
      mixerRef.current = new AnimationMixer(vrmRef.current.scene);

      // Apply the animation
      const action = mixerRef.current.clipAction(currentClip);
      action.setEffectiveTimeScale(0.6);
      action.setLoop(LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      action.play();

      // Initialize physics after animation setup
      if (vrmRef.current.springBoneManager) {
        vrmRef.current.springBoneManager.reset();
      }
    }
  }, [currentClip, isComplete, isLoadingAnimations]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        let cacheEntry = modelCache.get(url);

        if (!cacheEntry) {
          let resolvePromise: (value: VRM) => void;
          const promise = new Promise<VRM>((resolve) => {
            resolvePromise = resolve;
          });

          cacheEntry = {
            promise,
            progress: 0,
          };
          modelCache.set(url, cacheEntry);

          const loader = new GLTFLoader();
          loader.register((parser) => new VRMLoaderPlugin(parser));

          loader.load(
            url,
            async (gltf: GLTF) => {
              const vrm = gltf.userData.vrm;
              // Initialize VRM immediately after load
              VRMUtils.rotateVRM0(vrm);
              if (vrm.humanoid) {
                vrm.humanoid.resetPose();
              }
              if (vrm.springBoneManager) {
                vrm.springBoneManager.reset();
              }
              resolvePromise(vrm);
            },
            (progress: { loaded: number; total: number }) => {
              const progressValue = (progress.loaded / progress.total) * 100;
              cacheEntry!.progress = progressValue;
              onProgress?.(progressValue);
            },
            (error) => {
              console.error(`Error loading ${url}:`, error);
              modelCache.delete(url);
            }
          );
        } else {
          onProgress?.(cacheEntry.progress);
        }

        const vrm = await cacheEntry.promise;
        vrmRef.current = vrm;

        if (sceneRef.current) {
          while (sceneRef.current.children.length) {
            sceneRef.current.remove(sceneRef.current.children[0]);
          }
          sceneRef.current.add(vrm.scene);
          vrm.scene.rotation.y = Math.PI;
          vrm.scene.position.set(...position);
          onProgress?.(100);
          onLoaded?.();
        }
      } catch (error) {
        console.error(`Error loading ${url}:`, error);
        modelCache.delete(url);
      }
    };

    loadModel();

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
  }, [url]);

  useFrame(() => {
    const delta = clockRef.current.getDelta();
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    if (vrmRef.current) {
      vrmRef.current.update(delta);
    }
  });

  return <group ref={sceneRef} />;
}

export default function VRMViewer({ modelUrls }: { modelUrls: string[] }) {
  const loadedModelsRef = useRef<Record<string, boolean>>({});
  const [completeCharacters, setCompleteCharacters] = useState<
    Record<string, boolean>
  >({});
  const [loadingProgress, setLoadingProgress] = useState<
    Record<string, number>
  >({});
  const controlsRef = useRef<any>(null);

  const handleModelLoaded = (url: string) => {
    loadedModelsRef.current[url] = true;
    setLoadingProgress((prev) => ({
      ...prev,
      [url]: 100,
    }));

    // Check if this completes a character
    const characterId = url.match(/ID\d+/)?.[0];
    if (characterId) {
      const isComplete = modelUrls
        .filter((modelUrl) => modelUrl.includes(characterId))
        .every((modelUrl) => loadedModelsRef.current[modelUrl]);

      if (isComplete) {
        setCompleteCharacters((prev) => ({ ...prev, [characterId]: true }));
      }
    }
  };

  const handleProgress = (url: string, progress: number) => {
    setLoadingProgress((prev) => ({
      ...prev,
      [url]: progress,
    }));
  };

  const isCharacterComplete = (url: string) => {
    const characterId = url.match(/ID\d+/)?.[0];
    return characterId ? completeCharacters[characterId] : false;
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Calculate total loading progress
  const totalProgress =
    modelUrls.length > 0
      ? Object.values(loadingProgress).reduce((acc, curr) => acc + curr, 0) /
        modelUrls.length
      : 0;

  return (
    <div className="relative w-full aspect-square">
      {/* Loading Overlay */}
      {totalProgress < 100 && (
        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-32 h-32 relative">
            <svg
              className="animate-spin w-full h-full text-primary"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {Math.round(totalProgress)}%
              </span>
            </div>
          </div>
          <p className="mt-4 text-foreground font-medium">
            Loading 3D Model...
          </p>
        </div>
      )}

      {/* Camera Controls UI */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <button
          className="p-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
          title="Reset Camera"
          onClick={handleResetCamera}
        >
          <svg
            className="w-5 h-5 text-[#ededed]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </button>
      </div>

      <Canvas className="rounded-xl" shadows dpr={[1, 2]}>
        <AnimationProvider>
          <color attach="background" args={["#1a1a1a"]} />
          <fog attach="fog" args={["#1a1a1a", 5, 15]} />

          <PerspectiveCamera
            makeDefault
            position={[0, 0.8, 3]}
            fov={40}
            near={0.1}
            far={1000}
          />

          {/* Improved lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[1, 2, 2]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight
            position={[-1, 0.5, -2]}
            intensity={0.5}
            color="#4060ff"
          />

          {/* Environment and shadows */}
          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.75, 0]}
            opacity={0.65}
            scale={10}
            blur={2}
            far={4}
          />

          {modelUrls.map((url) => (
            <VRMModel
              key={url}
              url={url}
              position={[0, -0.75, 0]}
              onLoaded={() => handleModelLoaded(url)}
              onProgress={(progress) => handleProgress(url, progress)}
              isComplete={isCharacterComplete(url)}
            />
          ))}

          <OrbitControls
            ref={controlsRef}
            makeDefault
            minDistance={2}
            maxDistance={4.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0.3, 0]}
            enableDamping
            dampingFactor={0.05}
          />
        </AnimationProvider>
      </Canvas>
    </div>
  );
}
