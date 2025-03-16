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
  Bone,
  SkinnedMesh,
  Skeleton,
  MeshToonMaterial,
  TextureLoader,
  KeyframeTrack,
  AnimationAction,
} from "three";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
  // Core body
  mixamorigHips: "Hips",
  mixamorigSpine: "Spine",
  mixamorigSpine1: "Spine1",
  mixamorigSpine2: "Spine2",

  // Left arm and hand
  mixamorigLeftShoulder: "LeftShoulder",
  mixamorigLeftArm: "LeftArm",
  mixamorigLeftForeArm: "LeftForeArm",
  mixamorigLeftHand: "LeftHand",
  mixamorigLeftHandThumb1: "LeftHandThumb",
  mixamorigLeftHandThumb2: "LeftHandThumb1",
  mixamorigLeftHandThumb3: "LeftHandThumb2",
  mixamorigLeftHandIndex1: "LeftHandIndex",
  mixamorigLeftHandIndex2: "LeftHandIndex1",
  mixamorigLeftHandIndex3: "LeftHandIndex2",
  mixamorigLeftHandMiddle1: "LeftHandMiddle",
  mixamorigLeftHandMiddle2: "LeftHandMiddle1",
  mixamorigLeftHandMiddle3: "LeftHandMiddle2",

  // Right arm and hand
  mixamorigRightShoulder: "RightShoulder",
  mixamorigRightArm: "RightArm",
  mixamorigRightForeArm: "RightForeArm",
  mixamorigRightHand: "RightHand",
  mixamorigRightHandThumb1: "RightHandThumb",
  mixamorigRightHandThumb2: "RightHandThumb1",
  mixamorigRightHandThumb3: "RightHandThumb2",
  mixamorigRightHandIndex1: "RightHandIndex",
  mixamorigRightHandIndex2: "RightHandIndex1",
  mixamorigRightHandIndex3: "RightHandIndex2",
  mixamorigRightHandMiddle1: "RightHandMiddle",
  mixamorigRightHandMiddle2: "RightHandMiddle.001",
  mixamorigRightHandMiddle3: "RightHandMiddle.002",

  // Left leg
  mixamorigLeftUpLeg: "LeftUpLeg",
  mixamorigLeftLeg: "LeftLeg",
  mixamorigLeftFoot: "LeftFoot",

  // Right leg
  mixamorigRightUpLeg: "RightUpLeg",
  mixamorigRightLeg: "RightLeg",
  mixamorigRightFoot: "RightFoot",
};

// Add animation cache at the top with other constants
const animationCache = new Map<string, AnimationClip>();

function retargetAnimation(
  clip: AnimationClip,
  boneCache: BoneCache
): AnimationClip {
  const tracks = clip.tracks
    .filter((track) => {
      const [boneName] = track.name.split(".");
      return BONE_MAP[boneName] !== undefined;
    })
    .map((track) => {
      const [boneName, ...propertyParts] = track.name.split(".");
      const vrmBone = boneCache.mapAnimationBone(boneName);

      if (!vrmBone) return null;

      const newTrack = track.clone();
      newTrack.name = `${vrmBone.name}.${propertyParts.join(".")}`;
      return newTrack;
    })
    .filter((track): track is KeyframeTrack => track !== null);

  return new AnimationClip(clip.name, clip.duration, tracks);
}

// Modify AnimationContextType to include raw animations
interface AnimationContextType {
  currentClip: AnimationClip | null;
  setCurrentClip: (clip: AnimationClip) => void;
  isLoadingAnimations: boolean;
  rawAnimations: AnimationClip[];
}

const AnimationContext = createContext<AnimationContextType>({
  currentClip: null,
  setCurrentClip: () => {},
  isLoadingAnimations: true,
  rawAnimations: [],
});

function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [currentClip, setCurrentClip] = useState<AnimationClip | null>(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isLoadingAnimations, setIsLoadingAnimations] = useState(true);
  const [rawAnimations, setRawAnimations] = useState<AnimationClip[]>([]);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const loadAnimations = async () => {
      setIsLoadingAnimations(true);
      const fbxLoader = new FBXLoader();
      let loadedCount = 0;
      const animations: AnimationClip[] = [];

      try {
        await Promise.all(
          ANIMATIONS.map((animUrl, index) => {
            return new Promise<void>((resolve, reject) => {
              fbxLoader.load(
                animUrl,
                (fbx) => {
                  if (fbx.animations.length > 0) {
                    const clip = fbx.animations[0];
                    clip.name = `animation_${index}`;
                    animations[index] = clip;

                    loadedCount++;
                    if (loadedCount === ANIMATIONS.length) {
                      setRawAnimations(animations);
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
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentClip, animationIndex, isLoadingAnimations]);

  return (
    <AnimationContext.Provider
      value={{
        currentClip,
        setCurrentClip,
        isLoadingAnimations,
        rawAnimations,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

// Add BoneCache class before VRMModel
class BoneCache {
  private avatarBones: Record<string, Bone> = {};
  private clothesBones: Record<string, Record<string, Bone>> = {};
  private clothesMesh: Record<string, Record<string, SkinnedMesh>> = {};
  private skeleton: Skeleton | null = null;
  private humanoid: any = null; // VRM humanoid reference

  public setHumanoid(humanoid: any) {
    this.humanoid = humanoid;
  }

  public getHumanBoneNode(boneName: string): Bone | null {
    return this.humanoid?.getBoneNode(boneName) || null;
  }

  public mapAnimationBone(mixamoBoneName: string): Bone | null {
    // Map Mixamo bones to VRM bones
    const vrmBoneName = BONE_MAP[mixamoBoneName];
    if (!vrmBoneName) return null;

    // Get the actual bone from VRM humanoid
    return this.getHumanBoneNode(vrmBoneName);
  }

  public setAvatarBone(name: string, bone: Bone) {
    this.avatarBones[name] = bone;
  }

  public setBaseSkeleton(skeleton: Skeleton) {
    this.skeleton = skeleton;
  }

  public addClothesBone = (node: Bone, category: string) => {
    if (this.clothesBones[category]) {
      delete this.clothesBones[category][node.name];
    }
    if (!this.clothesBones[category]) {
      this.clothesBones[category] = {};
    }
    if (!this.clothesBones[category][node.name]) {
      this.clothesBones[category][node.name] = node;
    }
  };

  public addClothesMesh = (node: SkinnedMesh, category: string) => {
    if (this.clothesMesh[category]) {
      delete this.clothesMesh[category];
    }
    if (this.skeleton) {
      if (!this.clothesMesh[category]) {
        this.clothesMesh[category] = {};
      }
      if (!this.clothesMesh[category][node.name]) {
        this.clothesMesh[category][node.name] = node;
      }
      // Map clothes bones to the avatar bones
      const boneArray = node.skeleton.bones;
      for (let i = 0; i < boneArray.length; i++) {
        const name = boneArray[i].name;
        if (this.avatarBones[name]) {
          boneArray[i] = this.avatarBones[name];
        }
      }
      this.clothesMesh[category][node.name].skeleton = node.skeleton;
    }
  };

  public clear() {
    this.avatarBones = {};
    this.clothesBones = {};
    this.clothesMesh = {};
    this.skeleton = null;
  }
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
  isBaseModel = false,
}: VRMModelProps & { isBaseModel?: boolean }) {
  const vrmRef = useRef<VRM>();
  const gltfRef = useRef<GLTF>();
  const sceneRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer>();
  const clockRef = useRef<Clock>(new Clock());
  const boneCache = useRef<BoneCache>(new BoneCache());
  const { rawAnimations, currentClip, setCurrentClip, isLoadingAnimations } =
    useContext(AnimationContext);
  const retargetedAnimationsRef = useRef<AnimationClip[]>([]);
  const currentActionRef = useRef<AnimationAction | null>(null);

  // Function to process the base model
  const processBaseModel = (vrm: VRM) => {
    if (!isBaseModel) return;

    // Store humanoid reference
    boneCache.current.setHumanoid(vrm.humanoid);

    // Cache all bones from the base model
    vrm.scene.traverse((node) => {
      if (node instanceof Bone) {
        boneCache.current.setAvatarBone(node.name, node);
      }
      if (node instanceof SkinnedMesh) {
        boneCache.current.setBaseSkeleton(node.skeleton);
      }
    });
  };

  // Function to load clothes/accessories
  const loadClothes = async (scene: Group, category: string) => {
    if (!scene || isBaseModel) return;

    scene.traverse(async (node: any) => {
      // Handle bones
      if (node instanceof Bone) {
        boneCache.current.addClothesBone(node, category);
      }

      // Handle meshes
      if (node instanceof SkinnedMesh) {
        boneCache.current.addClothesMesh(node, category);
      }

      // Handle materials (simplified version - expand based on needs)
      if (node.material) {
        const oldMat = node.material;
        const toonMat = new MeshToonMaterial({
          transparent: true,
          color: "#ffffff",
          gradientMap: new TextureLoader().load("/three-tone.jpg"),
        });
        toonMat.map = oldMat.map;
        node.material = toonMat;
      }
    });
  };

  // Effect to handle animation retargeting when VRM and animations are ready
  useEffect(() => {
    if (
      isBaseModel &&
      vrmRef.current &&
      rawAnimations.length > 0 &&
      !isLoadingAnimations
    ) {
      console.log("Retargeting animations...");
      // Retarget all animations
      retargetedAnimationsRef.current = rawAnimations.map((clip) =>
        retargetAnimation(clip, boneCache.current)
      );

      // Set the first animation as current if none is set
      if (!currentClip) {
        console.log("Setting initial animation");
        setCurrentClip(retargetedAnimationsRef.current[0]);
      }
    }
  }, [
    isBaseModel,
    rawAnimations,
    isLoadingAnimations,
    setCurrentClip,
    currentClip,
  ]);

  // Effect to handle animation changes
  useEffect(() => {
    if (!isBaseModel || !vrmRef.current || !mixerRef.current || !currentClip)
      return;

    console.log("Applying animation:", currentClip.name);

    // Stop any current animation
    if (currentActionRef.current) {
      currentActionRef.current.stop();
    }

    // Find the retargeted version of the current clip
    const retargetedClip = retargetedAnimationsRef.current.find(
      (clip) => clip.name === currentClip.name
    );

    if (retargetedClip) {
      // Create and play the new animation
      const action = mixerRef.current.clipAction(retargetedClip);
      action.setEffectiveTimeScale(0.6);
      action.setLoop(LoopRepeat, Infinity);
      action.clampWhenFinished = false;
      action.play();

      // Store the current action
      currentActionRef.current = action;
    }
  }, [currentClip, isBaseModel]);

  // Animation and VRM update effect
  useEffect(() => {
    if (vrmRef.current && isComplete && !isLoadingAnimations) {
      console.log("Initializing animation system");

      // Ensure VRM is properly initialized
      VRMUtils.rotateVRM0(vrmRef.current);

      // Reset the mixer to ensure clean state
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(vrmRef.current.scene);
      }

      // Create new mixer on the root scene
      mixerRef.current = new AnimationMixer(vrmRef.current.scene);

      // Check for built-in VRM animations first
      const gltf = gltfRef.current;
      const animations = gltf?.animations;
      if (animations && animations.length > 0) {
        console.log("Found built-in VRM animations:", animations.length);
        // Use the first VRM animation
        const vrmClip = animations[0];
        const action = mixerRef.current.clipAction(vrmClip);
        action.setEffectiveTimeScale(1.0);
        action.setLoop(LoopRepeat, Infinity);
        action.clampWhenFinished = false;
        action.play();
        currentActionRef.current = action;
      } else if (currentClip && isBaseModel) {
        console.log("Using external animation:", currentClip.name);
        // Find the retargeted version of the current clip
        const retargetedClip = retargetedAnimationsRef.current.find(
          (clip) => clip.name === currentClip.name
        );

        if (retargetedClip) {
          const action = mixerRef.current.clipAction(retargetedClip);
          action.setEffectiveTimeScale(0.6);
          action.setLoop(LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.play();
          currentActionRef.current = action;
        }
      }

      // Initialize physics after animation setup
      if (vrmRef.current.springBoneManager) {
        vrmRef.current.springBoneManager.reset();
      }
    }
  }, [isComplete, isLoadingAnimations, isBaseModel, currentClip]);

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
              gltfRef.current = gltf;

              // Initialize VRM
              VRMUtils.rotateVRM0(vrm);
              if (vrm.humanoid) {
                vrm.humanoid.resetPose();
              }
              if (vrm.springBoneManager) {
                vrm.springBoneManager.reset();
              }

              // Process as base model or clothes
              if (isBaseModel) {
                processBaseModel(vrm);
              } else {
                // Extract category from URL or pass it as a prop
                const category =
                  url.split("/").pop()?.split(".")[0] || "default";
                await loadClothes(vrm.scene, category);
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
      // Clear bone cache on cleanup
      boneCache.current.clear();
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Define initial camera settings
  const INITIAL_CAMERA_POSITION = [0, 0.8, 3] as const;
  const INITIAL_TARGET_POSITION = [0, 0.3, 0] as const;

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
      // Reset camera position and target
      controlsRef.current.object.position.set(...INITIAL_CAMERA_POSITION);
      controlsRef.current.target.set(...INITIAL_TARGET_POSITION);
      controlsRef.current.update();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Calculate total loading progress
  const totalProgress =
    modelUrls.length > 0
      ? Object.values(loadingProgress).reduce((acc, curr) => acc + curr, 0) /
        modelUrls.length
      : 0;

  return (
    <div ref={containerRef} className="relative w-full aspect-square">
      {/* Loading Overlay */}
      {totalProgress < 100 && (
        <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-blue-500/20 animate-pulse" />
            <LoadingSpinner size="xl" variant="primary" />
          </div>
          <div className="mt-6 space-y-2 text-center">
            <p className="text-lg font-medium text-white">Loading 3D Model</p>
            <div className="flex items-center gap-2 text-sm text-blue-400/80">
              <div className="w-16 h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${Math.round(totalProgress)}%` }}
                />
              </div>
              <span>{Math.round(totalProgress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Camera Controls UI */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <button
          className="p-2 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
          title="Toggle Fullscreen"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
                d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          )}
        </button>
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
            position={INITIAL_CAMERA_POSITION}
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

          {modelUrls.map((url, index) => (
            <VRMModel
              key={url}
              url={url}
              position={[0, -0.75, 0]}
              onLoaded={() => handleModelLoaded(url)}
              onProgress={(progress) => handleProgress(url, progress)}
              isComplete={isCharacterComplete(url)}
              isBaseModel={index === 0} // Assume first model is base model
            />
          ))}

          <OrbitControls
            ref={controlsRef}
            makeDefault
            minDistance={2}
            maxDistance={4.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            target={INITIAL_TARGET_POSITION}
            enableDamping
            dampingFactor={0.05}
          />
        </AnimationProvider>
      </Canvas>
    </div>
  );
}
