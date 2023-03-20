import { Card, Text } from 'theme-ui'
import Icon from '@hackclub/icons'
import { returnLocalizedMessage } from '@/lib/helpers'

export default function ContactCard({ router }) {
  return (
    <Card
      px={[4, 4]}
      py={[3, 3]}
      mt={3}
      sx={{
        color: 'blue',
        display: 'flex',
        alignItems: 'center',
        '> svg': { display: ['none', 'inline'] }
      }}
    >
      <Icon glyph="message" />
      <Text sx={{ ml: 2 }}>
        {returnLocalizedMessage(router.locale, 'CONTACT_MESSAGE_FRONT')}{' '}
        <b>
          <Text
            as="a"
            href={`mailto:${returnLocalizedMessage(
              router.locale,
              'CONTACT_EMAIL'
            )}`}
            sx={{
              color: 'blue',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textDecorationStyle: 'wavy'
              }
            }}
          >
            {returnLocalizedMessage(router.locale, 'CONTACT_EMAIL')}
          </Text>
        </b>{' '}
        {returnLocalizedMessage(router.locale, 'CONTACT_MESSAGE_BACK')}
      </Text>
    </Card>
  )
}
