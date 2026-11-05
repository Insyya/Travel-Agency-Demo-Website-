"use client";

import { useEffect, useRef } from "react";
import { Compass } from "lucide-react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import styles from "./RoutePreloader.module.css";

const routePath = "M56 214C130 206 130 78 233 83C328 87 310 201 457 82";

type RoutePreloaderProps = {
  loaded: boolean;
  onRouteComplete: () => void;
};

export default function RoutePreloader({ loaded, onRouteComplete }: RoutePreloaderProps) {
  const routeRef = useRef<SVGPathElement>(null);
  const dashRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const route = routeRef.current;
    const dash = dashRef.current;
    const plane = planeRef.current;
    if (!route || !dash || !plane) return;

    gsap.registerPlugin(MotionPathPlugin);
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.001 : 4;
    const journey = gsap.timeline({ onComplete: onRouteComplete });

    journey
      .fromTo(dash, { strokeDashoffset: 0 }, { strokeDashoffset: -52, duration, ease: "none" }, 0)
      .to(plane, {
        duration,
        ease: "power1.inOut",
        motionPath: {
          path: route,
          align: route,
          alignOrigin: [0.5, 0.5],
          autoRotate: 90,
        },
      }, 0);

    return () => {
      journey.kill();
    };
  }, [onRouteComplete]);

  return (
    <div
      className={`${styles.preloader} ${loaded ? styles.loaded : ""}`}
      role="status"
      aria-label="Loading Voyago"
      aria-hidden={loaded}
    >
      <div className={styles.route} aria-hidden="true">
        <span className={styles.sun} />
        <span className={`${styles.coordinate} ${styles.origin}`}>
          40°43′ N<br /><b>YOUR EVERYDAY</b>
        </span>
        <svg className={styles.map} viewBox="0 0 520 290" fill="none">
          <path ref={routeRef} className={styles.routeBase} d={routePath} />
          <path ref={dashRef} className={styles.routeDash} d={routePath} />
          <circle className={styles.originStop} cx="56" cy="214" r="7" />
          <circle className={styles.destinationStop} cx="457" cy="82" r="7" />
          <g ref={planeRef} className={styles.plane}>
            <circle className={styles.planeHalo} r="23" />
            <path
              className={styles.planeIcon}
              d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
              transform="translate(-12 -12)"
            />
          </g>
        </svg>
        <span className={`${styles.coordinate} ${styles.destination}`}>
          48°51′ N<br /><b>SOMEWHERE NEW</b>
        </span>
        <span className={styles.caption}><Compass size={14} /> THE SCENIC ROUTE</span>
      </div>
      <span className={styles.screenReaderText}>
        Preparing your journey. The plane is following its route.
      </span>
    </div>
  );
}
