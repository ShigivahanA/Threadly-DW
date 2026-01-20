// src/utils/appInfo.ts
import Constants from 'expo-constants'

const expoConfig =
  Constants.expoConfig ??
  Constants.manifest ??
  {}

export const APP_NAME =
  expoConfig.name ?? 'Threadly'

export const VERSION =
  expoConfig.version ?? '—'

export const BUILD_DATE = new Date().toLocaleDateString()
