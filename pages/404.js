import { Flex, Heading } from 'theme-ui'

export default function NotFound() {
  return (
    <Flex
      sx={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        marginTop: '-50px'
      }}
    >
      <Heading sx={{ color: 'white', fontSize: 6 }}>
        Oops, looks like we couldn't find that :(
      </Heading>
    </Flex>
  )
}
