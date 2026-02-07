import { normalize } from '../utils/responsive'

export const typography = {
  title: {
    fontSize: normalize(26),
    fontWeight: '600' as const,
  },
  subtitle: {
    fontSize: normalize(14),
  },
  label: {
    fontSize: normalize(13),
    fontWeight: '500' as const,
  },
  input: {
    fontSize: normalize(16),
  },
  button: {
    fontSize: normalize(16),
    fontWeight: '500' as const,
  },
}
