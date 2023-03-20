import { Box, Text, Link } from 'theme-ui'
import { returnLocalizedMessage } from '@/lib/helpers'
import Icon from '@hackclub/icons'

export default function OpenSourceCard({ router }) {
  return (
    <Link
      sx={{
        display: ['none', 'flex'],
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        cursor: 'pointer',
        placeItems: 'center',
        background: '#00000002',
        px: 2,
        borderRadius: '15px',
        textDecoration: 'none',
        color: 'black'
      }}
      href="https://github.com/hackclub/turnover"
      target="_blank"
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
    </Link>
  )
}
