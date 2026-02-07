import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native'
import Animated, {
  SlideInDown, // Changed from SlideInTop
  SlideOutUp,   // Changed from SlideOutTop
  Layout
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

type ToastType = 'success' | 'error' | 'info' | 'danger'

type ToastContextType = {
  show: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const [toast, setToast] = useState<{ message: string; type: ToastType; id: number } | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const show = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    if (timerRef.current) clearTimeout(timerRef.current as any)

    // Haptic feedback based on type
    if (type === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => { })
    } else if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { })
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { })
    }

    setToast({ message, type, id: Date.now() })

    timerRef.current = setTimeout(() => {
      setToast(null)
    }, duration) as any
  }, [])

  const config = {
    success: { icon: 'checkmark-circle' as const, color: '#4ade80' },
    error: { icon: 'alert-circle' as const, color: '#f87171' },
    danger: { icon: 'warning' as const, color: '#fb923c' },
    info: { icon: 'information-circle' as const, color: '#60a5fa' },
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <View
        style={[
          styles.container,
          { top: insets.top + spacing.sm }
        ]}
        pointerEvents="box-none"
      >
        {toast && (
          <Animated.View
            key={toast.id}
            entering={SlideInDown.duration(500)} // Changed from SlideInTop.springify().damping(20).mass(0.8)
            exiting={SlideOutUp.duration(500)}   // Changed from SlideOutTop
            layout={Layout.duration(300)}
            style={styles.wrapper}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 70 : 80} // Higher intensity for better glass
              tint={theme === 'dark' ? 'dark' : 'light'}
              style={[
                styles.toast,
                {
                  borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
                }
              ]}
            >
              {/* Status Dot/Icon Area */}
              <View style={[styles.iconContainer, { backgroundColor: config[toast.type].color + '20' }]}>
                <Ionicons
                  name={config[toast.type].icon}
                  size={18}
                  color={config[toast.type].color}
                />
              </View>

              <Text style={[
                styles.text,
                { color: colors.textPrimary }
              ]}>
                {toast.message}
              </Text>
            </BlurView>
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50, // Pill Shape
    borderWidth: 1,
    overflow: 'hidden', // Required for blur overflow
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    letterSpacing: -0.2,
  },
})
