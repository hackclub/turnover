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
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import nookies, { destroyCookie } from 'nookies'
import { returnLocalizedMessage, validate } from '../../../../lib/helpers'
import TimelineCard from '../../../../components/Timeline'
import ContactCard from '../../../../components/ContactCard'
import OpenSourceCard from '../../../../components/OpenSourceCard'

export default function TurnoverReview({
  notFound,
  params,
  turnoverRecord,
  leaderRecord,
  trackerRecord
}) {
  const router = useRouter()
  const [inviteMessage, setInviteMessage] = useState('')
  const [submitButton, setSubmitButton] = useState(
    `${returnLocalizedMessage(router.locale, 'SUBMIT_YOUR_APPLICATION')}`
  )
  const [emailToInvite, setEmailToInvite] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [warning, setWarning] = useState(false)
  const [acceptCOC, setAcceptCOC] = useState(false)

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
      router.replace(router.asPath, null, { scroll: false })
    } else {
      console.error(deleteLeaderCall)
      setInviteMessage(`❌ ${returnLocalizedMessage(router.locale, 'ERROR')}`)
    }
  }

  async function submitApplication() {
    const submissionAPICall = await fetch(
      `/api/submit?id=${params.turnover}`
    ).then(r => r.json())
    if (submissionAPICall.success) {
      setSubmitButton(
        `✅ ${returnLocalizedMessage(router.locale, 'SUBMITTED')}`
      )
      router.push(`/turnover/${params.turnover}/${params.leader}/status`)
    } else {
      console.error(submissionAPICall)
      setSubmitButton(`❌ ${returnLocalizedMessage(router.locale, 'ERROR')}`)
    }
  }

  if (notFound) return <Error statusCode="404" />
  return (
    <Container py={4} variant="copy">
      <TimelineCard
        router={router}
        turnoverRecord={turnoverRecord}
        leaderRecord={leaderRecord}
        trackerRecord={trackerRecord}
        params={params}
      />
      <Card px={[4, 4]} py={[4, 4]} mt={1}>
        <Heading sx={{ fontSize: [3, 4] }}>
          <Text>
            {turnoverRecord.fields['Submitted'] ? (
              <Text>
                {returnLocalizedMessage(router.locale, 'YOUVE_SUBMITTED')}{' '}
                <Link href={`/${params.turnover}/${params.leader}/status`}>
                  {returnLocalizedMessage(router.locale, 'CHECK_CLUB_STATUS')}
                </Link>
              </Text>
            ) : (
              <Text>
                {returnLocalizedMessage(
                  router.locale,
                  'LETS_REVIEW_EVERYTHING'
                )}
              </Text>
            )}
          </Text>
        </Heading>
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
        {turnoverRecord.fields['Leaders Emails'].map(
          (leaderEmail, leaderIndex) => (
            <Box
              key={leaderIndex}
              sx={{
                display: ['block', 'flex'],
                alignItems: 'center',
                mt: 3,
                flexWrap: 1
              }}
            >
              <Text
                sx={{
                  display: ['none', 'block']
                }}
              >
                <Icon
                  className="importantIcon"
                  glyph={
                    turnoverRecord.fields['Leaders Complete?'][leaderIndex]
                      ? 'leaders'
                      : 'leaders'
                  }
                  color={
                    turnoverRecord.fields['Leaders Complete?'][leaderIndex]
                      ? '#33d6a6'
                      : '#ff8c37'
                  }
                />
              </Text>
              <Heading
                sx={{
                  color: [
                    turnoverRecord.fields['Leaders Complete?'][leaderIndex]
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
                        turnoverRecord.fields['Prospective Leaders'][
                          leaderIndex
                        ]
                      )
                    }
                  >
                    {turnoverRecord.fields['Prospective Leaders'][
                      leaderIndex
                    ] === inviteMessage[0] || inviteMessage[0] === null
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
                    turnoverRecord.fields['Prospective Leaders'][
                      leaderIndex
                    ] === inviteMessage[0]
                      ? '-8px'
                      : '0px'
                  }`
                }}
                onClick={() => (
                  setInviteMessage([
                    turnoverRecord.fields['Prospective Leaders'][leaderIndex],
                    returnLocalizedMessage(router.locale, 'ARE_YOU_SURE')
                  ]),
                  setWarning(!warning)
                )}
              >
                <Icon
                  glyph={
                    warning &&
                    turnoverRecord.fields['Prospective Leaders'][
                      leaderIndex
                    ] === inviteMessage[0]
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
                    turnoverRecord.fields['Prospective Leaders'][leaderIndex]
                  )
                }
              ></Box>
            </Box>
          )
        )}
        <Box mt={3} sx={{ display: ['block', 'flex'], alignItems: 'center' }}>
          <Input
            sx={{
              border: '0.5px solid',
              fontSize: 1,
              borderColor: 'rgb(221, 225, 228)',
              mr: [0, 3],
              mb: [3, 0]
            }}
            disabled={turnoverRecord.fields['Submitted'] ? true : false}
            onChange={e => setEmailToInvite(e.target.value)}
            value={emailToInvite}
            placeholder={returnLocalizedMessage(
              router.locale,
              'NEW_CO_LEADER_EMAIL'
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
              cursor: `${
                turnoverRecord.fields['Submitted'] ? 'not-allowed' : 'pointer'
              }`
            }}
            onClick={() => sendInvite()}
          >
            <Icon glyph={'send-fill'} />
            <Text mr={2}>
              {returnLocalizedMessage(router.locale, 'SEND_INVITE')}
            </Text>
          </Flex>
        </Box>
        <Divider sx={{ color: 'slate', my: [3, 4] }} />
        <Link
          href={`/turnover/${params.turnover}/${params.leader}/leader`}
          style={{ textDecoration: 'none' }}
        >
          <Flex
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
              color: [
                leaderRecord.fields['Completed'] == 1 ? '#33d6a6' : '#ff8c37',
                'accent'
              ],
              '> svg': { display: ['none', 'inline'] }
            }}
          >
            {leaderRecord.fields['Completed'] == 1 ? (
              <Icon glyph="profile" color="#33d6a6" />
            ) : (
              <Icon glyph="profile" color="#ff8c37" />
            )}
            <Heading
              sx={{
                flexGrow: 1,
                ml: [0, 2]
              }}
              as="h1"
            >
              {returnLocalizedMessage(router.locale, 'MY_PERSONAL_PROFILE')}
            </Heading>
            <Icon glyph="post" />
          </Flex>
        </Link>
        <Divider sx={{ color: 'slate', my: [3, 4] }} />
        <Link
          href={`/${params.turnover}/${params.leader}/club`}
          style={{ textDecoration: 'none' }}
        >
          <Flex
            sx={{
              alignItems: 'center',
              color: [
                turnoverRecord.fields['Completed'] == 1 ? '#33d6a6' : '#ff8c37',
                'accent'
              ],
              cursor: 'pointer',
              '> svg': { display: ['none', 'inline'] }
            }}
          >
            {turnoverRecord.fields['Completed'] == 1 ? (
              <Icon glyph="flag" color="#33d6a6" />
            ) : (
              <Icon glyph="important" color="#ff8c37" />
            )}
            <Heading
              sx={{
                flexGrow: 1,
                ml: [0, 2]
              }}
              as="h1"
            >
              {returnLocalizedMessage(router.locale, 'YOUR_CLUB')}
            </Heading>
            <Icon glyph="post" />
          </Flex>
        </Link>
        <Divider sx={{ color: 'slate', my: [3, 4] }} />
        <Heading
          sx={{
            color: 'slate',
            ml: 1,
            flexGrow: 1,
            textTransform: 'uppercase'
          }}
        >
          <a
            target="_blank"
            href="https://hackclub.com/conduct"
            style={{ textDecoration: 'none' }}
          >
            <Text
              sx={{
                color: 'slate',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  textDecorationStyle: 'wavy'
                }
              }}
            >
              {returnLocalizedMessage(router.locale, 'CODE_OF_CONDUCT')}
            </Text>
          </a>
        </Heading>
        <Flex
          sx={{
            alignItems: 'center',
            cursor: 'pointer',
            mt: '20px',
            '> svg': { display: ['none', 'inline'] }
          }}
        >
          {acceptCOC || turnoverRecord.fields['Submitted'] ? (
            <Icon
              glyph="checkmark"
              color="#33d6a6"
              onClick={() => setAcceptCOC(false)}
            />
          ) : (
            <Icon
              glyph="checkbox"
              color="#000000"
              onClick={() => setAcceptCOC(true)}
            />
          )}

          <Heading
            sx={{
              flexGrow: 1,
              color: [
                leaderRecord.fields['Completed'] == 1 ? '#33d6a6' : '#ff8c37',
                'blue'
              ],
              ml: [0, 2]
            }}
            as="h3"
          >
            <Text onClick={() => setAcceptCOC(!acceptCOC)}>
              {returnLocalizedMessage(router.locale, 'THE_TEAM_AGREES')}
            </Text>{' '}
            <a
              target="_blank"
              href="https://hackclub.com/conduct"
              style={{ textDecoration: 'none' }}
            >
              <Text
                sx={{
                  color: 'blue',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { textDecorationStyle: 'wavy' }
                }}
              >
                {returnLocalizedMessage(
                  router.locale,
                  'HACK_CLUB_CODE_OF_CONDUCT'
                )}
              </Text>
            </a>
          </Heading>
        </Flex>
        <Button
          sx={{
            mt: 4,
            width: '100%',
            textTransform: 'uppercase',
            ...(turnoverRecord.fields['All Complete (incl Leaders)'] != 1 ||
            acceptCOC === false ||
            turnoverRecord.fields['Submitted']
              ? {
                  opacity: 0.3,
                  ':hover,:focus': {
                    transform: 'none',
                    boxShadow: 'none',
                    cursor: 'not-allowed'
                  }
                }
              : {})
          }}
          variant="ctaLg"
          onClick={() =>
            turnoverRecord.fields['All Complete (incl Leaders)'] != 1 ||
            acceptCOC === false ||
            turnoverRecord.fields['Submitted']
              ? console.log(`You're not done hacker.`)
              : submitApplication()
          }
        >
          {submitButton}
        </Button>
      </Card>
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
      <ContactCard router={router} />
      <OpenSourceCard router={router} />
    </Container>
  )
}

export async function getServerSideProps({ req, res, params }) {
  const {
    prospectiveLeadersAirtable,
    turnoverAirtable,
    trackerAirtable
  } = require('../../../../lib/airtable')
  const cookies = nookies.get({ req })
  if (cookies.authToken && cookies.authType === 'Turnover') {
    try {
      const leaderRecord = await prospectiveLeadersAirtable.find(
        'rec' + params.leader
      )
      const turnoverRecord = await turnoverAirtable.find(
        'rec' + params.turnover
      )
      const trackerRecord = await trackerAirtable.read({
        filterByFormula: `{Venue} = "${turnoverRecord.fields['School Name']}"`,
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
