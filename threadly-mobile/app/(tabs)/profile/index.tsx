import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Dimensions, TextInput } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router'
import { BlurView } from 'expo-blur'
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
  useDerivedValue
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { normalize } from '@/src/utils/responsive'

import wardrobeService from '@/src/services/wardrobeService'
import outfitService from '@/src/services/outfitService'
import { logout } from '@/src/services/authService'
import { useToast } from '@/src/components/Toast/ToastProvider'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

const { width } = Dimensions.get('window')
const MONO = Platform.OS === 'ios' ? 'Courier' : 'monospace'

/* ------------------------------------------------------------------
   COMPONENTS
------------------------------------------------------------------ */

const MenuItem = ({ title, icon, route, index, isDestructive = false, onPressCustom }: any) => {
  const { theme } = useTheme()
  const router = useRouter()
  const colors = theme === 'dark' ? darkColors : lightColors

  const handlePress = async () => {
    await Haptics.selectionAsync()
    if (onPressCustom) {
      onPressCustom()
    } else if (route) {
      router.push(route)
    }
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(600).easing(Easing.out(Easing.cubic))}
      style={{ marginBottom: 12 }}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.menuItem,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            transform: [{ scale: pressed ? 0.98 : 1 }]
          }
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.1)' : (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') }]}>
          <Ionicons
            name={icon}
            size={18}
            color={isDestructive ? '#ef4444' : colors.textPrimary}
          />
        </View>
        <Text style={[styles.menuText, { color: isDestructive ? '#ef4444' : colors.textPrimary }]}>
          {title.toUpperCase()}
        </Text>
        {!isDestructive && (
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
        )}
      </Pressable>
    </Animated.View>
  )
}
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <Animated.View
      entering={FadeInDown.delay(600).duration(800).easing(Easing.out(Easing.cubic))}
      style={[styles.themeRow, { borderColor: colors.border, backgroundColor: colors.surface }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={[styles.technicalLabel, { color: colors.textSecondary }]}>// APPEARANCE</Text>
      </View>

      <View style={[styles.togglePill, { backgroundColor: theme === 'dark' ? '#000' : '#ececec' }]}>
        {(['light', 'dark'] as const).map((mode) => (
          <Pressable
            key={mode}
            onPress={() => { Haptics.selectionAsync(); setTheme(mode) }}
            style={[
              styles.toggleOption,
              theme === mode && { backgroundColor: theme === 'dark' ? '#333' : '#fff' }
            ]}
          >
            <Text style={{ fontSize: normalize(9), fontFamily: MONO, fontWeight: '900', color: theme === mode ? colors.textPrimary : colors.textSecondary }}>
              {mode.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  )
}



const NumberTicker = ({ value, style }: { value: number, style?: any }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const animatedValue = useSharedValue(0)

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 1500, easing: Easing.out(Easing.exp) })
  }, [value])

  useDerivedValue(() => {
    const val = Math.round(animatedValue.value)
    runOnJS(setDisplayValue)(val)
  })

  return (
    <Text style={style}>
      {displayValue}
    </Text>
  )
}

/* ------------------------------------------------------------------
   MAIN SCREEN
------------------------------------------------------------------ */

export default function Profile() {
  const { theme, setTheme } = useTheme() // ✅ GLOBAL
  const colors = theme === 'dark' ? darkColors : lightColors
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const toast = useToast()

  // Stats State
  const [favCount, setFavCount] = useState(0)
  const [itemsCount, setItemsCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)

  // Fetch Data
  const fetchData = async () => {
    try {
      // Parallel fetch
      const [clothesRes, outfitsRes] = await Promise.all([
        wardrobeService.getItems(),
        outfitService.getOutfits()
      ])

      // Unpack Wardrobe items
      // @ts-ignore 
      const clothesRaw = (clothesRes as any)?.data ?? clothesRes
      const clothes = (clothesRaw?.items || (Array.isArray(clothesRaw) ? clothesRaw : []))

      // Unpack Outfits
      // @ts-ignore
      const outfitsRaw = (outfitsRes as any)?.data ?? outfitsRes
      const outfits = (outfitsRaw?.outfits || outfitsRaw?.items || (Array.isArray(outfitsRaw) ? outfitsRaw : []))

      if (Array.isArray(clothes)) {
        setItemsCount(clothes.length)
        setFavCount(clothes.filter((c: any) => c.isFavorite).length)
      }
      if (Array.isArray(outfits)) {
        setSavedCount(outfits.length)
      }

    } catch (e) {
      console.error("Failed to fetch profile stats", e)
    }
  }

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  // Handle Logout
  const handleLogout = async () => {
    toast.show('Terminating session...', 'info')
    try {
      await logout()
      toast.show('Session terminated', 'success')
      router.replace('/')
    } catch {
      toast.show('Termination failed', 'error')
    }
  }

  const menuItems = [
    { title: "Favourites", icon: "heart-outline", route: "/(tabs)/profile/favourites" },
    { title: "Saved outfits", icon: "bookmark-outline", route: "/(tabs)/profile/saved-outfits" },
    { title: "Account & Security", icon: "person-outline", route: "/(tabs)/profile/account" },
    { title: "Contact support", icon: "mail-outline", route: "/(tabs)/profile/contact" },
    { title: "Storage", icon: "server-outline", route: "/(tabs)/profile/storage" },
    { title: "Privacy policy", icon: "shield-checkmark-outline", route: "/(tabs)/profile/privacy" },
    { title: "About", icon: "information-circle-outline", route: "/(tabs)/profile/about" },
  ]

  const tabBarHeight = useBottomTabBarHeight()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + tabBarHeight + 20,
          paddingHorizontal: spacing.xl
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Animated.View entering={FadeInDown.duration(800)}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>// USER_PROFILE</Text>
            <Text style={[styles.username, { color: colors.textPrimary }]}>IDENTITY.</Text>
          </Animated.View>
        </View>

        {/* STATS CARD */}
        <Animated.View
          entering={FadeIn.delay(300).duration(800)}
          style={[styles.glassCard, {
            borderColor: colors.border,
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
          }]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardHeaderText, { color: colors.textSecondary }]}>// DATA_METRICS_V4</Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <NumberTicker value={favCount} style={[styles.statNum, { color: colors.textPrimary }]} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>FAVOURITES</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <NumberTicker value={itemsCount} style={[styles.statNum, { color: colors.textPrimary }]} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ARTIFACTS</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <NumberTicker value={savedCount} style={[styles.statNum, { color: colors.textPrimary }]} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>SAVED</Text>
            </View>
          </View>

          {/* Brackets */}
          <View style={[styles.bracket, { top: 0, left: 0, borderTopWidth: 1, borderLeftWidth: 1, borderColor: colors.textSecondary, opacity: 0.2 }]} />
          <View style={[styles.bracket, { top: 0, right: 0, borderTopWidth: 1, borderRightWidth: 1, borderColor: colors.textSecondary, opacity: 0.2 }]} />
          <View style={[styles.bracket, { bottom: 0, left: 0, borderBottomWidth: 1, borderLeftWidth: 1, borderColor: colors.textSecondary, opacity: 0.2 }]} />
          <View style={[styles.bracket, { bottom: 0, right: 0, borderBottomWidth: 1, borderRightWidth: 1, borderColor: colors.textSecondary, opacity: 0.2 }]} />
        </Animated.View>

        {/* MENU */}
        <View style={styles.menuSection}>
          <ThemeToggle />
          <View style={{ height: 16 }} />
          {menuItems.map((item, index) => (
            <MenuItem key={item.title} {...item} index={index} />
          ))}
          <View style={{ height: 16 }} />
          <MenuItem
            title="Log Out"
            icon="log-out-outline"
            isDestructive={true}
            index={menuItems.length}
            onPressCustom={handleLogout}
          />
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: normalize(10),
    fontFamily: MONO,
    fontWeight: '700',
    letterSpacing: 2,
  },
  username: {
    fontSize: normalize(34),
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  glassCard: {
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 40,
    position: 'relative',
    padding: 20,
  },
  cardHeader: {
    marginBottom: 20,
    opacity: 0.6,
  },
  cardHeaderText: {
    fontSize: normalize(8),
    fontFamily: MONO,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: normalize(20),
    fontFamily: MONO,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: normalize(8),
    fontFamily: MONO,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 20,
    opacity: 0.3,
  },
  bracket: {
    position: 'absolute',
    width: 12,
    height: 12,
  },
  menuSection: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: normalize(11),
    fontFamily: MONO,
    fontWeight: '900',
    letterSpacing: 0.5,
    flex: 1,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  togglePill: {
    flexDirection: 'row',
    borderRadius: 6,
    padding: 3,
    gap: 3,
  },
  toggleOption: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  technicalLabel: {
    fontSize: normalize(9),
    fontFamily: MONO,
    fontWeight: '700',
  }
})
