"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM, VRMUtils } from "@pixiv/three-vrm";
import type { GLTF } from "three/addons/loaders/GLTFLoader.js";
import {
  Mesh,
  Material,
  BufferGeometry,
  Group,
  Bone,
  SkinnedMesh,
  Skeleton,
  MeshToonMaterial,
  TextureLoader,
} from "three";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const totalProgress =
    modelUrls.length > 0
      ? Object.values(loadingProgress).reduce((acc, curr) => acc + curr, 0) /
        modelUrls.length
      : 0;

  return (
    <div ref={containerRef} className="relative w-full aspect-square">
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
        <color attach="background" args={["#1a1a1a"]} />
        <fog attach="fog" args={["#1a1a1a", 5, 15]} />

        <PerspectiveCamera
          makeDefault
          position={INITIAL_CAMERA_POSITION}
          fov={40}
          near={0.1}
          far={1000}
        />

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
            isBaseModel={index === 0}
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
      </Canvas>
    </div>
  );
}
