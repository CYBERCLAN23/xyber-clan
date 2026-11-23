import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, MorphSVGPlugin, DrawSVGPlugin, CustomEase, useGSAP);

// Brand motion curves. "out" settles like the pill strokes locking into the X;
// "spring" is the clan figure's head; "inOut" is for travelling surfaces.
CustomEase.create('xc.out', '0.16, 1, 0.3, 1');
CustomEase.create('xc.inOut', '0.65, 0, 0.35, 1');
CustomEase.create('xc.snap', '0.7, 0, 0.2, 1');

export const EASE = {
  out: 'xc.out',
  inOut: 'xc.inOut',
  snap: 'xc.snap',
  spring: 'elastic.out(1, 0.55)',
  soft: 'power2.out',
};

export const DUR = { micro: 0.25, quick: 0.45, base: 0.8, slow: 1.2 };

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

gsap.defaults({ ease: EASE.out, duration: DUR.base });

export { gsap, ScrollTrigger, SplitText, Flip, MorphSVGPlugin, DrawSVGPlugin, CustomEase, useGSAP };
