// src/hooks/use-is-mobile.ts
"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const updateMobileStatus = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Initial check
    updateMobileStatus();
    
    // Listen for changes
    mediaQuery.addEventListener("change", updateMobileStatus);
    
    return () => mediaQuery.removeEventListener("change", updateMobileStatus);
  }, []);

  return isMobile;
}