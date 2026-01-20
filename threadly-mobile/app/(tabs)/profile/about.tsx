import LegalScreen from '@/src/components/LegalScreen'
import { APP_NAME, VERSION, BUILD_DATE } from '@/src/utils/appInfo'

export default function AboutScreen() {
  return (
    <LegalScreen
      title="About"
      sections={[
        {
          title: 'What is Threadly?',
          text:
            'Threadly is a personal digital wardrobe designed to help you understand, organize, and reuse what you already own. It is intentionally calm, private, and free from algorithmic pressure.',
        },
        {
          title: 'Why it exists',
          text:
            'Most wardrobe apps focus on trends, shopping, or recommendations. Threadly focuses on ownership — helping you wear your clothes better instead of buying more.',
        },
        {
          title: 'Privacy by design',
          text:
            'Your wardrobe belongs to you. Threadly does not sell your data, inject ads, or optimize for engagement loops. The product is designed to stay useful, not addictive.',
        },
        {
          title: 'Built for longevity',
          text:
            'Threadly is designed to age well. Features are added slowly and intentionally, with long-term usability prioritized over novelty.',
        },
        {
          title: 'App information',
          text:
            `Name: ${APP_NAME}\nVersion: ${VERSION}\nBuild date: ${BUILD_DATE}`,
        },
      ]}
    />
  )
}
