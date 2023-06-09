import Error from 'next/error'
import {
  Box,
  Input,
  Divider,
  Card,
  Container,
  Text,
  Button,
  Heading,
  Flex,
  Grid
} from 'theme-ui'
import Icon from '@hackclub/icons'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import nookies, { destroyCookie } from 'nookies'
import { validateEmail, returnLocalizedMessage } from '../../lib/helpers'
import ContactCard from '../../components/ContactCard'
import OpenSourceCard from '../../components/OpenSourceCard'

export default function Invite({
  notFound,
  params,
  turnoverRecord,
  leaderRecord,
  trackerRecord
}) {
  const [inviteMessage, setInviteMessage] = useState([])
  const [warning, setWarning] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [emailToInvite, setEmailToInvite] = useState('')
  const router = useRouter()

  const showSuccess = () => setButtonMessage('SUCCESS')

  async function sendInvite() {
    if (validateEmail(emailToInvite)) {
      const loginAPICall = await fetch(
        `/api/invite?email=${encodeURIComponent(emailToInvite)}&id=${
          params.turnover
        }&locale=${router.locale}`
      ).then(r => r.json())
      if (loginAPICall.success) {
        setInviteMessage([
          turnoverRecord.fields['Prospective Leaders'][
            turnoverRecord.fields['Prospective Leaders'].length + 1
          ],
          `✅ ${returnLocalizedMessage(router.locale, 'INVITED')}`
        ])
        setEmailToInvite('')
        setErrorMessage(null)
        router.replace(router.asPath, null, { scroll: false })
      } else {
        console.error(loginAPICall)
        setInviteMessage([
          turnoverRecord.fields['Prospective Leaders'][
            turnoverRecord.fields['Prospective Leaders'].length + 1
          ],
          `✅ ${returnLocalizedMessage(router.locale, 'INVITED')}`
        ])
        setErrorMessage(`❌ ${returnLocalizedMessage(router.locale, 'ERROR')}`)
      }
    } else
      setErrorMessage(
        `❌ ${returnLocalizedMessage(router.locale, 'INVALID_EMAIL_ADDRESS')}`
      )
  }
  async function deleteLeader(leaderID) {
    const deleteLeaderCall = await fetch(
      `/api/remove?id=${params.turnover}&leaderID=${leaderID}`
    ).then(r => r.json())
    if (deleteLeaderCall.success) {
      setInviteMessage(`✅ ${returnLocalizedMessage(router.locale, 'REMOVED')}`)
      setErrorMessage(null)
      router.replace(router.asPath, null, { scroll: false })
    } else {
      console.error(deleteLeaderCall)
      setErrorMessage(`❌ ${returnLocalizedMessage(router.locale, 'ERROR')}`)
    }
  }

  if (notFound) return <Error statusCode="404" />
  return (
    <Container py={4} variant="copy">
      <Card px={[4, 4]} py={[4, 4]} mt={1}>
        <Heading sx={{ fontSize: [3, 4] }}>
          <Text>{returnLocalizedMessage(router.locale, 'TURNOVER')}</Text>
        </Heading>
        <Box sx={{ color: 'black', fontSize: '16px', mt: [3] }}>
          <Text sx={{ alignItems: 'center', textAlign: 'center' }}>
            {returnLocalizedMessage(router.locale, 'TURNOVER_START')}
          </Text>
        </Box>
        <Divider sx={{ color: 'slate', my: [3, 4] }} />
        <Heading
          sx={{
            color: 'slate',
            ml: 1,
            flexGrow: 1,
            textTransform: 'uppercase'
          }}
        >
          {returnLocalizedMessage(router.locale, 'LEADERS')}
        </Heading>
        {turnoverRecord.fields['Leaders Emails'] &&
          turnoverRecord.fields['Leaders Emails'].map((leaderEmail, idx) => (
            <Box
              key={idx}
              sx={{
                display: ['block', 'flex'],
                alignItems: 'center',
                mt: 3,
                flexWrap: 1
              }}
            >
              <Text sx={{ display: ['none', 'block'] }}>
                <Icon
                  className="importantIcon"
                  glyph={
                    turnoverRecord.fields['Leaders Complete?'][idx]
                      ? 'leaders'
                      : 'leaders'
                  }
                  color={
                    turnoverRecord.fields['Leaders Complete?'][idx]
                      ? '#33d6a6'
                      : '#33d6a6'
                  }
                />
              </Text>
              <Heading
                sx={{
                  color: [
                    turnoverRecord.fields['Leaders Complete?'][idx]
                      ? '#33d6a6'
                      : '#ff8c37',
                    'placeholder'
                  ],
                  ml: [0, 2],
                  transform: 'translateY(-4px)',
                  flexGrow: 1
                }}
                as="h2"
              >
                {leaderEmail}
              </Heading>
              {warning ? (
                <>
                  <Text
                    sx={{
                      cursor: 'pointer',
                      color: 'placeholder',
                      ':hover': { color: 'red' },
                      display: [
                        'none',
                        leaderEmail != leaderRecord['fields']['Email']
                          ? 'block'
                          : 'none'
                      ],
                      transform: 'translateY(-0.2px)',
                      mr: '5px'
                    }}
                    onClick={() =>
                      deleteLeader(
                        turnoverRecord.fields['Prospective Leaders'][idx + 1]
                      )
                    }
                  >
                    {turnoverRecord.fields['Prospective Leaders'][idx] ===
                      inviteMessage[0] || inviteMessage[0] === null
                      ? `${inviteMessage[1]}`
                      : null}
                  </Text>
                </>
              ) : null}
              <Text
                sx={{
                  cursor: 'pointer',
                  color: 'placeholder',
                  ':hover': { color: 'slate' },
                  display: [
                    'none',
                    leaderEmail != leaderRecord['fields']['Email']
                      ? 'block'
                      : 'none'
                  ],
                  transform: 'translateY(-0.2px)',
                  mr: '5px',
                  mb: `${
                    warning &&
                    turnoverRecord.fields['Prospective Leaders'][idx] ===
                      inviteMessage[0]
                      ? '-8px'
                      : '0px'
                  }`
                }}
                onClick={() => (
                  setInviteMessage([
                    turnoverRecord.fields['Prospective Leaders'][idx],
                    returnLocalizedMessage(router.locale, 'ARE_YOU_SURE')
                  ]),
                  setWarning(!warning)
                )}
              >
                <Icon
                  glyph={
                    warning &&
                    turnoverRecord.fields['Prospective Leaders'][idx] ===
                      inviteMessage[0]
                      ? 'menu'
                      : 'member-remove'
                  }
                />
              </Text>
              <Box
                sx={{
                  ':hover,:focus': turnoverRecord.fields['Submitted']
                    ? {}
                    : { color: 'red' },
                  cursor: turnoverRecord.fields['Submitted']
                    ? 'not-allowed'
                    : 'pointer',
                  color: 'placeholder',
                  fontSize: '16px',
                  ml: [0, 2],
                  display: ['block', 'none']
                }}
                onClick={() =>
                  deleteLeader(
                    turnoverRecord.fields['Prospective Leaders'][idx + 1]
                  )
                }
              >
                Remove Leader
              </Box>
            </Box>
          ))}
        {errorMessage ? (
          <>
            <Box
              sx={{
                pt: 4
              }}
            >
              <Text as="b">{errorMessage}</Text>
            </Box>
          </>
        ) : null}
        <Box>
          <Box mt={3} sx={{ display: ['block', 'flex'], alignItems: 'center' }}>
            <Input
              sx={{
                border: '0.5px solid',
                fontSize: 1,
                borderColor: 'rgb(221, 225, 228)',
                mr: [0, 3],
                mb: [3, 0]
              }}
              onChange={e => setEmailToInvite(e.target.value)}
              value={emailToInvite}
              placeholder={returnLocalizedMessage(
                router.locale,
                'CO_LEADER_EMAIL'
              )}
            />
            <Flex
              sx={{
                bg: 'blue',
                borderRadius: '999px',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                color: 'white',
                boxShadow: 'card',
                height: '40px',
                minWidth: '150px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={() => sendInvite()}
            >
              <Icon glyph={'send-fill'} />
              <Text mr={2}>
                {returnLocalizedMessage(router.locale, 'SEND_INVITE')}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Card>
      <ContactCard router={router} />
      <Box
        sx={{
          display: ['none', 'flex'],
          position: 'fixed',
          left: '10px',
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
        <Icon
          glyph="door-leave"
          style={{
            color: 'placeholder',
            opacity: 0.9
          }}
        />
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
          {returnLocalizedMessage(router.locale, 'LOGOUT')}
        </Text>
      </Box>
      <OpenSourceCard router={router} />
    </Container>
  )
}

export async function getServerSideProps({ res, req, params }) {
  const {
    prospectiveLeadersAirtable,
    turnoverAirtable,
    trackerAirtable
  } = require('../../lib/airtable')
  const cookies = nookies.get({ req })
  if (cookies.authToken && cookies.authType === 'Turnover Invite') {
    try {
      const leaderRecord = await prospectiveLeadersAirtable.find(
        'rec' + params.alumni
      )
      console.log('rec' + params.turnover)
      const turnoverRecord = await turnoverAirtable.find(
        'rec' + params.turnover
      )
      const trackerRecord = await trackerAirtable.read({
        filterByFormula: `{App ID} = "rec${params.turnover}"`,
        maxRecords: 1
      })
      if (leaderRecord.fields['Accepted Tokens'].includes(cookies.authToken)) {
        return {
          props: { params, turnoverRecord, leaderRecord, trackerRecord }
        }
      } else {
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    } catch (e) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
}
