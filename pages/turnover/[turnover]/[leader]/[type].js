import Error from 'next/error'
import {
  Box,
  Input,
  Card,
  Container,
  Text,
  Button,
  Flex,
  Select,
  Textarea,
  Field
} from 'theme-ui'
import Icon from '@hackclub/icons'
import { useState, useEffect, useRef } from 'react'
import manifest from '../../../../manifest'
import nookies, { destroyCookie } from 'nookies'
import {
  returnLocalizedMessage,
  returnLocalizedQuestionText,
  handleChangeInDate,
  invalidBirthdate
} from '../../../../lib/helpers'
import TimelineCard from '../../../../components/Timeline'
import { countryCodeData, flags } from '../../../../lib/countrycodes'
import { useRouter } from 'next/router'

const SavedInfo = ({ saved, poster, router }) => (
  <Box
    sx={{
      display: ['none', 'flex'],
      position: 'fixed',
      right: '10px',
      bottom: '10px',
      cursor: 'pointer',
      placeItems: 'center',
      background: '#00000005',
      px: 2,
      borderRadius: '15px'
    }}
    onClick={poster}
  >
    <Text
      sx={{
        color: saved ? '#33d6a6' : '#ff8c37',
        fontWeight: '800',
        textTransform: 'uppercase'
      }}
    >
      {saved
        ? returnLocalizedMessage(router.locale, 'SAVED')
        : returnLocalizedMessage(router.locale, 'SAVE')}
    </Text>
    <Icon
      glyph={saved ? 'checkmark' : 'important'}
      color={saved ? '#33d6a6' : '#ff8c37'}
    />
  </Box>
)

export default function TurnoverClub({
  notFound,
  turnoverRecord,
  leaderRecord,
  trackerRecord,
  params
}) {
  const router = useRouter()
  const slug = router.asPath.split('/')[4]

  const [data, setData] = useState(
    params.type === 'club' ? turnoverRecord.fields : leaderRecord.fields
  )
  const [lastData, setLastData] = useState({})
  const [saved, setSavedState] = useState(true)
  const [disabled, setDisabled] = useState(
    invalidBirthdate(
      leaderRecord.fields['Birthday'],
      turnoverRecord.fields['Leader Birthdays']
    )
  )

  useEffect(() => {
    const type = slug === 'club' ? turnoverRecord.fields : leaderRecord.fields
    if (data !== type) router.reload()
  }, [slug || params.type])

  const savingStateRef = useRef(saved)
  const setSaved = data => {
    savingStateRef.current = data
    setSavedState(data)
  }

  const poster = async () => {
    const appOrLeader = params.type === 'club' ? params.turnover : params.leader
    const msg = { body: JSON.stringify(data), method: 'POST' }
    const fetched = await fetch(
      `/api/${params.type}/save?id=${appOrLeader}`,
      msg
    )
    const json = await fetched.json()
    if (json.success) {
      setSaved(true)
      setLastData(json)
    } else {
      console.error(json)
      alert(`❌ ${returnLocalizedMessage(router.locale, 'ERROR')}`)
    }
    return json
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lastData !== data) {
        poster()
        setLastData(data)
      }
    }, 3500)
    return () => clearTimeout(timer)
  }, [data])

  useEffect(() => {
    window.addEventListener('beforeunload', function (e) {
      if (!savingStateRef.current) {
        e.preventDefault()
        e.returnValue = ''
      } else delete e['returnValue']
    })
  })

  async function goHome(autoSave = true) {
    if (!saved) {
      if (
        autoSave ||
        window.confirm(
          returnLocalizedMessage(router.locale, 'ARE_YOU_SURE_YOU_WANT_TO_SAVE')
        )
      ) {
        await poster()
      }
    }
    leaderRecord.fields['Email'] !=
      turnoverRecord.fields['Leaders Emails'][0] || params.type === 'club'
      ? router.push(`/turnover/${params.turnover}/${params.leader}/review`)
      : router.push(`/turnover/${params.turnover}/${params.leader}/club`)
  }

  if (notFound) return <Error statusCode="404" />
  return (
    <Container py={4} variant="copy">
      <TimelineCard
        router={router}
        turnoverRecord={turnoverRecord}
        leaderRecord={leaderRecord}
        data={data}
        params={params}
        saved={saved}
        trackerRecord={trackerRecord}
      />
      <SavedInfo saved={saved} poster={poster} router={router} />
      <Card px={[4, 4]} py={[4, 4]}>
        {(params.type === 'club' ? manifest.clubs : manifest.leaders).map(
          (sectionItem, sectionIndex) => (
            <Box key={sectionIndex}>
              {sectionItem.header === 'Leaders' &&
              turnoverRecord.fields['Leaders Emails'].length === 1 ? null : (
                <>
                  <Box
                    sx={{
                      textAlign: 'left',
                      mt: `${
                        params.type === 'club' && sectionItem.header === 'Venue'
                          ? '-1rem'
                          : '0'
                      }`
                    }}
                  >
                    <Text
                      sx={{ color: 'red', fontSize: '27px', fontWeight: 800 }}
                    >
                      {returnLocalizedQuestionText(
                        router.locale,
                        sectionItem,
                        'header'
                      )}
                    </Text>
                  </Box>
                </>
              )}
              <Box>
                {sectionItem.label && (
                  <Box sx={{ color: 'muted', mb: 3 }}>
                    {returnLocalizedQuestionText(
                      router.locale,
                      sectionItem,
                      'label'
                    )}
                  </Box>
                )}
                {sectionItem.items.map((item, index) => (
                  <Box
                    mt={1}
                    mb={3}
                    key={'form-item-' + sectionIndex + '-' + index}
                  >
                    {(item.key === 'Leaders Relationship' ||
                      item.key === 'President') &&
                    turnoverRecord.fields['Prospective Leaders'].length ===
                      1 ? null : item.key === 'Code' ? null : (
                      <>
                        {item.key === 'Phone' ? (
                          <Text sx={{ fontSize: '20px' }}>
                            {returnLocalizedMessage(
                              router.locale,
                              'PHONE_NUMBER'
                            )}
                          </Text>
                        ) : null}
                        <Box
                          sx={{
                            display: `${
                              item.key === 'Phone' ? 'flex' : 'grid'
                            }`,
                            flexDirection: ['column', 'row'],
                            gap: '15px'
                          }}
                        >
                          {item.key === 'Phone' ? (
                            <>
                              <Field
                                disabled={
                                  turnoverRecord.fields['Submitted']
                                    ? true
                                    : disabled
                                }
                                as={Select}
                                onChange={e => {
                                  let newData = {}
                                  newData['Code'] = e.target.value
                                  setData({ ...data, ...newData })
                                  setSaved(false)
                                }}
                                type={'select'}
                                name="code"
                                value={
                                  data['Code'] !== undefined ? data['Code'] : ''
                                }
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'rgb(221, 225, 228)',
                                  resize: 'vertical',
                                  display: 'grid'
                                }}
                                children={
                                  <>
                                    <option value="" disabled>
                                      {returnLocalizedMessage(
                                        router.locale,
                                        'SELECT_ONE'
                                      )}
                                    </option>
                                    {countryCodeData.map((country, idx) => {
                                      return (
                                        <option key={idx}>
                                          {country.iso}{' '}
                                          {flags[`${country.iso}`]?.emoji} +
                                          {country.code}
                                        </option>
                                      )
                                    })}
                                  </>
                                }
                              />
                            </>
                          ) : null}
                          <Field
                            label={
                              <Text>
                                {returnLocalizedQuestionText(
                                  router.locale,
                                  item,
                                  'label'
                                )}{' '}
                                <Text
                                  sx={{
                                    color: 'muted',
                                    display: item.optional ? 'inline' : 'none'
                                  }}
                                >
                                  {returnLocalizedMessage(
                                    router.locale,
                                    'OPTIONAL'
                                  )}
                                </Text>
                              </Text>
                            }
                            disabled={
                              turnoverRecord.fields['Submitted']
                                ? true
                                : disabled && item.inputType !== 'date'
                                ? true
                                : false
                            }
                            onChange={e => {
                              let newData = {}
                              newData['President'] = `${
                                turnoverRecord.fields['Leaders Emails'].length >
                                1
                                  ? data['President']
                                  : turnoverRecord.fields['Leaders Emails'][0]
                              }`
                              newData[item.key] = `${
                                item.key === 'President'
                                  ? newData['President']
                                  : e.target.value
                              }`
                              setData({ ...data, ...newData })
                              setSaved(false)
                            }}
                            placeholder={returnLocalizedQuestionText(
                              router.locale,
                              item,
                              'placeholder'
                            )}
                            as={
                              item.type === 'string'
                                ? Input
                                : item.type === 'paragraph'
                                ? Textarea
                                : Select
                            }
                            type={item.inputType}
                            value={
                              item.key === 'President'
                                ? turnoverRecord.fields['Leaders Emails'][0]
                                : data[item.key] !== undefined
                                ? data[item.key]
                                : ''
                            }
                            onInput={
                              item.inputType === 'date'
                                ? e => {
                                    handleChangeInDate(
                                      e.target.value,
                                      turnoverRecord.fields['Leader Birthdays'],
                                      setDisabled
                                    )
                                  }
                                : null
                            }
                            sx={{
                              border: '1px solid',
                              borderColor: 'rgb(221, 225, 228)',
                              resize: 'vertical',
                              width: `${
                                item.key === 'Phone' ? '40rem' : '100%'
                              }`,
                              maxWidth: '100%'
                            }}
                            {...(item.type === 'select'
                              ? item.options
                                ? {
                                    children: (
                                      <>
                                        <option value="" disabled>
                                          {returnLocalizedMessage(
                                            router.locale,
                                            'SELECT_ONE'
                                          )}
                                        </option>
                                        {returnLocalizedQuestionText(
                                          router.locale,
                                          item,
                                          'options'
                                        ).map(option => (
                                          <option key={option}>{option}</option>
                                        ))}
                                      </>
                                    )
                                  }
                                : {
                                    children: (
                                      <>
                                        <option value="" disabled>
                                          {returnLocalizedMessage(
                                            router.locale,
                                            'SELECT_ONE'
                                          )}
                                        </option>
                                        {turnoverRecord.fields[
                                          item.optionsKey
                                        ].map(option => (
                                          <option key={option}>{option}</option>
                                        ))}
                                      </>
                                    )
                                  }
                              : {})}
                          />
                        </Box>
                        {item.inputType === 'date' ? (
                          <Text
                            sx={{
                              color: 'red',
                              marginTop: 2
                            }}
                            as="p"
                          >
                            {disabled ? (
                              <Text>
                                {returnLocalizedMessage(
                                  router.locale,
                                  'FYI_WE_DONT_ACCEPT_FROM_UNI_AND_TEACHERS'
                                )}{' '}
                                <Text
                                  as="b"
                                  href={`mailto:${returnLocalizedMessage(
                                    router.locale,
                                    'CONTACT_EMAIL'
                                  )}`}
                                  sx={{
                                    color: 'red',
                                    textDecoration: 'none',
                                    '&:hover': {
                                      textDecoration: 'underline',
                                      textDecorationStyle: 'wavy'
                                    }
                                  }}
                                >
                                  {returnLocalizedMessage(
                                    router.locale,
                                    'CONTACT_EMAIL'
                                  )}
                                </Text>{' '}
                                {returnLocalizedMessage(
                                  router.locale,
                                  'FOR_MORE_DETAILS'
                                )}
                              </Text>
                            ) : null}
                          </Text>
                        ) : null}
                        {item.words && (
                          <Text
                            sx={{ fontSize: '18px', color: 'muted', mt: 1 }}
                            as="p"
                          >
                            {returnLocalizedMessage(
                              router.locale,
                              'AIM_FOR_BETWEEN'
                            )}{' '}
                            {item.words}{' '}
                            {returnLocalizedMessage(router.locale, 'WORDS')}
                            {data[item.key] &&
                              ', ' +
                                data[item.key].split(' ').length +
                                ' ' +
                                returnLocalizedMessage(
                                  router.locale,
                                  data[item.key].split(' ').length === 1
                                    ? 'WORD'
                                    : 'WORDS'
                                ) +
                                ' ' +
                                returnLocalizedMessage(router.locale, 'SO_FAR')}
                          </Text>
                        )}
                        {item.sublabel && (
                          <Text
                            sx={{ fontSize: '16px', color: 'muted' }}
                            as="p"
                          >
                            {returnLocalizedQuestionText(
                              router.locale,
                              item,
                              'sublabel'
                            )}
                          </Text>
                        )}
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )
        )}
        <Button
          sx={{
            mt: 3,
            width: '100%',
            textTransform: 'uppercase'
          }}
          variant="ctaLg"
          onClick={() => goHome(true)}
        >
          {returnLocalizedMessage(router.locale, 'CONTINUE')}
          <Icon glyph="view-forward" />
        </Button>
      </Card>
    </Container>
  )
}

export async function getServerSideProps({ res, req, params }) {
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
