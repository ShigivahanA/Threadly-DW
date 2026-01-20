import LegalScreen from '@/src/components/LegalScreen'

export default function PrivacyScreen() {
  return (
    <LegalScreen
      title="Privacy Policy"
      sections={[
        {
          title: 'Our philosophy',
          text:
            'This product is built around personal ownership and privacy. Your wardrobe data exists to serve you — not advertisers, algorithms, or external platforms.',
        },
        {
          title: 'What we collect',
          text:
            'We collect only what is necessary for the app to function: account credentials, wardrobe items you add, and outfits you choose to save.',
        },
        {
          title: 'What we do not do',
          text:
            'We do not sell your data. We do not track you across the web. We do not inject advertisements or recommendation engines without your consent.',
        },
        {
          title: 'Data storage',
          text:
            'Your data is securely stored and tied only to your account. You may delete items or your entire account at any time.',
        },
        {
          title: 'Contact',
          text:
            'If you have questions or concerns about privacy, reach out directly. We believe privacy conversations should be human.',
        },
      ]}
    />
  )
}
