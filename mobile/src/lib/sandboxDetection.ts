// Sandbox Detection - Detects if app is running in development/sandbox environment
// This menu should NEVER appear in production (App Store, TestFlight)

import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Checks if the app is running in a sandbox/development environment
 * Returns true for:
 * - Expo Go
 * - Development builds
 * - Simulator/Emulator
 *
 * Returns false for:
 * - App Store builds
 * - TestFlight builds
 * - Production builds
 */
export function isSandboxEnvironment(): boolean {
  // Check if running in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';

  // Check if it's a development build
  const isDevelopmentBuild = __DEV__;

  // Check the execution environment
  const executionEnvironment = Constants.executionEnvironment;
  const isStoreClient = executionEnvironment === 'storeClient';

  // If it's a store client (App Store / TestFlight), never show sandbox menu
  if (isStoreClient) {
    return false;
  }

  // Return true if any development indicator is present
  return isExpoGo || isDevelopmentBuild;
}

/**
 * Gets detailed environment info for debugging
 */
export function getEnvironmentInfo(): {
  appOwnership: string | null;
  executionEnvironment: string;
  isDevice: boolean;
  platform: string;
  isDev: boolean;
  appVersion: string;
  buildNumber: string;
  expoVersion: string | null;
} {
  return {
    appOwnership: Constants.appOwnership ?? 'standalone',
    executionEnvironment: Constants.executionEnvironment ?? 'unknown',
    isDevice: Constants.isDevice ?? false,
    platform: Platform.OS,
    isDev: __DEV__,
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
    buildNumber: Platform.OS === 'ios'
      ? (Constants.expoConfig?.ios?.buildNumber ?? '1')
      : (Constants.expoConfig?.android?.versionCode?.toString() ?? '1'),
    expoVersion: Constants.expoConfig?.sdkVersion ?? null,
  };
}
