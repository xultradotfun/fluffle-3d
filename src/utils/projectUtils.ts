import overridesConfig from '@/data/ecosystem-overrides.json';
import { Project } from '@/types/ecosystem';

interface OverridesConfig {
  overrides: string[];
}

export function getProjectImage(project: Project): string {
  const config = overridesConfig as OverridesConfig;
  console.log('getProjectImage', project.twitter, config.overrides.includes(project.twitter));
  
  // 1. Check for manual override in config (list of handles)
  // The override implies we should use the local avatar file
  if (config.overrides.includes(project.twitter)) {
    return `/avatars/${project.twitter}.jpg`;
  }

  // 2. Check for API provided image
  if (project.img) {
    return project.img;
  }

  // 3. Fallback to local avatar based on twitter handle
  return `/avatars/${project.twitter}.jpg`;
}
