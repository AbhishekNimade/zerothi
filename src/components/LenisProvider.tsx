"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import React from "react";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        lerp: 0.1,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
