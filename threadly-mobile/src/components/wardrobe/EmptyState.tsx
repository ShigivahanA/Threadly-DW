import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { spacing } from '@/src/theme/spacing'

export default function EmptyState({ onReset }: { onReset?: () => void }) {
  const router = useRouter()

  return (
    <View style={styles.wrap}>
      {/* Visual anchor */}
      <View style={styles.iconWrap}>
        <View style={styles.icon} />
      </View>

      {/* Text */}
      <Text style={styles.title}>Your wardrobe is empty</Text>

      <Text style={styles.desc}>
        This space is reserved for pieces you love.
        Upload your first item or adjust filters to begin curating.
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        {onReset && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync()
              onReset()
            }}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>
              Clear filters
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => {
            Haptics.selectionAsync()
            router.push('/upload')
          }}
          style={styles.primary}
        >
          <Text style={styles.primaryText}>
            Add your first item
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },

  iconWrap: {
    marginBottom: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9ca3af',
  },

  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },

  desc: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 280,
  },

  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
    width: '100%',
  },

  secondary: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryText: {
    fontSize: 14,
    color: '#374151',
  },

  primary: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  primaryText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
})
