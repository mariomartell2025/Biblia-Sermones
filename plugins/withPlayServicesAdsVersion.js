const { withProjectBuildGradle } = require('@expo/config-plugins');

// Fuerza una versión específica de play-services-ads (y sus sub-artefactos)
// en todo el árbol de dependencias de Android.
//
// Por qué: react-native-google-mobile-ads resuelve la versión más reciente
// de Google (25.4.0 al momento de escribir esto), que Google compiló con una
// versión de Kotlin más nueva (metadata 2.3.0) que la que usa por defecto
// este proyecto (espera 2.1.0). Eso rompe compileReleaseKotlin con:
// "Module was compiled with an incompatible version of Kotlin.
//  The binary version of its metadata is 2.3.0, expected version is 2.1.0."
//
// Subir el Kotlin de todo el proyecto a 2.3.0 (probado) rompe a su vez el
// propio plugin de Gradle de React Native (KotlinJvmCompilerOptions.getJvmDefault
// no existe en esa versión del Kotlin Gradle Plugin que usa RN). Por eso, en
// vez de tocar el Kotlin del proyecto, se fija una versión anterior de
// play-services-ads que fue compilada con una versión de Kotlin compatible.
//
// La versión exacta se verificó descargando cada .aar y decodificando los
// bytes de versión de sus archivos .kotlin_module (no adivinando):
//   25.4.0 -> Kotlin metadata 2.3.0 (falla)
//   24.9.0 -> Kotlin metadata 2.2.0 (también fallaría)
//   24.0.0 -> Kotlin metadata 2.1.0 (coincide exactamente con lo esperado)
const PLAY_SERVICES_ADS_VERSION = '24.0.0';

module.exports = function withPlayServicesAdsVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('withPlayServicesAdsVersion espera build.gradle en Groovy');
    }
    const marker = '// @generated withPlayServicesAdsVersion';
    if (config.modResults.contents.includes(marker)) {
      return config;
    }
    const injected = `
${marker}
allprojects {
  configurations.all {
    resolutionStrategy {
      // Solo se fuerza el artefacto que react-native-google-mobile-ads declara
      // directamente; sus sub-artefactos transitivos (-api, -base, etc.) los
      // resuelve Gradle siguiendo el POM de ESTA versión, ya consistentes entre
      // sí. Forzar cada sub-artefacto a mano casi rompe esto: play-services-ads-lite
      // no publicó un 24.9.0 (salta de 24.8.0 a 25.0.0) y play-services-ads-identifier
      // ni siquiera llega a la serie 24.x — forzar versiones inexistentes hace
      // fallar la resolución de Gradle.
      force 'com.google.android.gms:play-services-ads:${PLAY_SERVICES_ADS_VERSION}'
    }
  }
}
`;
    config.modResults.contents += injected;
    return config;
  });
};
