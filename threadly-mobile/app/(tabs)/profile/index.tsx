import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

export default function Profile() {
  const { theme, setTheme } = useTheme() // ✅ GLOBAL
  const colors = theme === 'dark' ? darkColors : lightColors
  const insets = useSafeAreaInsets()

  const navigate = async (route: string) => {
    await Haptics.selectionAsync()
    router.push(route)
  }

  const Item = ({
    title,
    icon,
    route,
  }: {
    title: string
    icon: keyof typeof Ionicons.glyphMap
    route: string
  }) => (
    <Pressable
      onPress={() => navigate(route)}
      style={[
        styles.item,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.textPrimary} />
      <Text style={[styles.itemText, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textSecondary}
      />
    </Pressable>
  )

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Profile
      </Text>

      <View style={styles.section}>
        <Item
          title="Favourites"
          icon="heart-outline"
          route="/(tabs)/profile/favourites"
        />
        <Item
          title="Saved outfits"
          icon="bookmark-outline"
          route="/(tabs)/profile/saved-outfits"
        />
        <Item
          title="Account & Security"
          icon="person-outline"
          route="/(tabs)/profile/account"
        />
        <Item
          title="Privacy policy"
          icon="shield-checkmark-outline"
          route="/(tabs)/profile/privacy"
        />
        <Item
          title="Terms & conditions"
          icon="document-text-outline"
          route="/(tabs)/profile/terms"
        />
        <Item
          title="Contact support"
          icon="mail-outline"
          route="/(tabs)/profile/contact"
        />
        <Item
          title="Storage"
          icon="server-outline"
          route="/(tabs)/profile/storage"
        />
        <Item
          title="About"
          icon="information-circle-outline"
          route="/(tabs)/profile/about"
        />
      </View>
      {/* Appearance */}
      <View
        style={[
          styles.appearance,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.appearanceLeft}>
          <Ionicons
            name="moon-outline"
            size={20}
            color={colors.textPrimary}
          />
          <Text
            style={[
              styles.appearanceText,
              { color: colors.textPrimary },
            ]}
          >
            Appearance
          </Text>
        </View>

        <View
          style={[
            styles.toggle,
            { backgroundColor: colors.background },
          ]}
        >
          {(['light', 'dark'] as const).map((mode) => {
            const active = theme === mode

            return (
              <Pressable
                key={mode}
                onPress={async () => {
                  await Haptics.selectionAsync()
                  setTheme(mode) // ✅ GLOBAL UPDATE
                }}
                style={[
                  styles.toggleItem,
                  active && { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: active
                      ? colors.textPrimary
                      : colors.textSecondary,
                  }}
                >
                  {mode === 'light' ? 'Light' : 'Dark'}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
  },
  itemText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 15,
    fontWeight: '500',
  },
  appearance: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appearanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  appearanceText: {
    fontSize: 15,
    fontWeight: '500',
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 3,
    gap: 2,
  },
  toggleItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
})
