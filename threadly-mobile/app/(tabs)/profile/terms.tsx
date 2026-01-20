import LegalScreen from '@/src/components/LegalScreen'

export default function TermsScreen() {
  return (
    <LegalScreen
      title="Terms of Service"
      sections={[
        {
          title: 'Using the service',
          text:
            'By using this application, you agree to use it respectfully and lawfully. This service exists to help manage personal wardrobe data.',
        },
        {
          title: 'Your responsibility',
          text:
            'You are responsible for the content you upload. Do not upload content you do not own or have rights to.',
        },
        {
          title: 'Service availability',
          text:
            'We strive for reliability, but the service is provided as-is. Features may evolve as the product grows.',
        },
        {
          title: 'Account termination',
          text:
            'You may stop using the service at any time. We reserve the right to suspend accounts used for abuse or unlawful activity.',
        },
        {
          title: 'Contact',
          text:
            'Questions about these terms are welcome. Transparency matters more than fine print.',
        },
      ]}
    />
  )
}
