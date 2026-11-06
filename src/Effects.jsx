import { useEffect } from 'react';
import { mountSplashCursor } from './effects/splash-cursor.js';
import { mountSkillsGlobe } from './effects/skills-globe.js';
import { mountExperiencePixels } from './effects/experience-pixels.js';

/** Attach effects after React commits their canvas and section elements. */
export default function Effects() {
  useEffect(() => {
    const cleanups = [];
    try {
      for (const mount of [mountSplashCursor, mountSkillsGlobe, mountExperiencePixels]) {
        cleanups.push(mount());
      }
    } catch (error) {
      for (const cleanup of cleanups.reverse()) cleanup?.();
      throw error;
    }
    return () => {
      for (const cleanup of cleanups.reverse()) cleanup?.();
    };
  }, []);
  return null;
}
