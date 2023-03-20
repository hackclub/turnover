import { Box, Text } from 'theme-ui'
import { returnLocalizedMessage } from '@/lib/helpers'
import Icon from '@hackclub/icons'
import { destroyCookie } from 'nookies'

export default function OpenSourceCard({ router }) {
  return (
    <Box
      sx={{
        display: ['none', 'flex'],
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        cursor: 'pointer',
        placeItems: 'center',
        background: '#00000002',
        px: 2,
        borderRadius: '15px'
      }}
      onClick={async () => {
        await destroyCookie(null, 'authToken', {
          path: '/'
        })
        router.push('/', '/', { scroll: false })
      }}
    >
      <Text
        sx={{
          color: 'slate',
          opacity: 0.9,
          fontWeight: '800',
          textTransform: 'uppercase',
          opacity: 1,
          display: ['none', 'none', 'none', 'grid'],
          transition: '0.5s ease-in-out',
          mx: '5px',
          ':hover,:focus': {
            opacity: 1,
            transition: '0.5s ease-in-out',
            color: '#ec3750'
          }
        }}
      >
        {returnLocalizedMessage(router.locale, 'PROUDLY_OPEN_SOURCE')}
      </Text>
      <Icon
        glyph="github"
        sx={{
          color: '#000000',
          opacity: 0.8
        }}
      />
    </Box>
  )
}
