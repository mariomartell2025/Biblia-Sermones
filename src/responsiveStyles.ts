import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ResponsiveLayout } from './useResponsive';

export const responsiveStyles = (r: ResponsiveLayout) => ({
  // Contenedores
  container: {
    flex: 1,
    paddingHorizontal: r.padding,
  } as ViewStyle,

  scrollContent: {
    paddingHorizontal: r.padding,
    paddingVertical: r.gap * 2,
    maxWidth: r.size === 'xl' ? 1200 : r.size === 'lg' ? 900 : '100%',
    alignSelf: 'center' as const,
    width: '100%',
  } as ViewStyle,

  // Secciones
  section: {
    marginBottom: r.gap * 3,
  } as ViewStyle,

  sectionHeader: {
    marginBottom: r.gap,
  } as ViewStyle,

  // Filas y grillas
  row: {
    flexDirection: 'row' as const,
    gap: r.gap,
    marginBottom: r.gap,
  } as ViewStyle,

  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: r.gap,
  } as ViewStyle,

  // Tipografía escalada
  h1: {
    fontSize: 28 * r.fontSize,
    fontWeight: '800',
  } as TextStyle,

  h2: {
    fontSize: 20 * r.fontSize,
    fontWeight: '800',
  } as TextStyle,

  body: {
    fontSize: 16 * r.fontSize,
    lineHeight: 24 * r.fontSize,
  } as TextStyle,

  small: {
    fontSize: 12 * r.fontSize,
    lineHeight: 16 * r.fontSize,
  } as TextStyle,
});
