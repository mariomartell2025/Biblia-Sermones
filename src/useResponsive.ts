import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // 375 | 480 | 768 | 1024 | 1366+
export type Orientation = 'portrait' | 'landscape';

export interface ResponsiveLayout {
  device: DeviceType;
  size: ScreenSize; // fino-grained
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  width: number;
  height: number;

  // Espaciado dinámico
  padding: number; // global padding
  gap: number; // gap entre elementos
  fontSize: number; // ajuste global de fuente

  // Layout
  columns: number;
  sidebarWidth?: number;
}

export function useResponsive(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;

    // Breakpoints finos
    let size: ScreenSize;
    let device: DeviceType;
    let padding: number;
    let gap: number;
    let fontSize: number;
    let columns: number;

    if (width < 380) { // iPhone SE, etc
      size = 'xs';
      device = 'mobile';
      padding = 12;
      gap = 6;
      fontSize = 0.9;
      columns = 1;
    } else if (width < 500) { // iPhone 12/13 mini
      size = 'sm';
      device = 'mobile';
      padding = 14;
      gap = 8;
      fontSize = 0.95;
      columns = 1;
    } else if (width < 768) { // iPhone grande / small tablet portrait
      size = 'md';
      device = 'mobile';
      padding = 16;
      gap = 10;
      fontSize = 1;
      columns = 1;
    } else if (width < 1024) { // iPad / tablet
      size = 'lg';
      device = 'tablet';
      padding = isLandscape ? 32 : 20;
      gap = isLandscape ? 14 : 12;
      fontSize = 1;
      columns = isLandscape ? 2 : 1;
    } else { // iPad Pro / desktop
      size = 'xl';
      device = 'desktop';
      padding = 40;
      gap = 16;
      fontSize = 1.05;
      columns = 2;
    }

    return {
      device,
      size,
      orientation: isLandscape ? 'landscape' : 'portrait',
      isMobile: device === 'mobile',
      isTablet: device === 'tablet',
      isDesktop: device === 'desktop',
      isLandscape,
      width,
      height,
      padding,
      gap,
      fontSize,
      columns,
      sidebarWidth: device === 'desktop' ? 300 : undefined,
    };
  }, [width, height]);
}
