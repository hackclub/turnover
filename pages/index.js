import nookies from 'nookies'

export default function Index() {}

export async function getServerSideProps(ctx) {
  const { loginsAirtable } = require('../lib/airtable')
  const cookies = nookies.get(ctx)
  if (cookies.authToken) {
    try {
      const tokenRecord = await loginsAirtable.find('rec' + cookies.authToken)
      let res = ctx.res
      res.statusCode = 302
      if (tokenRecord.fields.Type === 'Turnover')
        return {
          redirect: {
            destination: `/${
              tokenRecord.fields['Locale with a slash']
                ? tokenRecord.fields['Locale with a slash']
                : ''
            }/turnover/${tokenRecord.fields['Path']}`,
            permanent: false
          }
        }
      else if (tokenRecord.fields.Type === 'Turnover Invite')
        return {
          redirect: {
            destination: `/${
              tokenRecord.fields['Locale with a slash']
                ? tokenRecord.fields['Locale with a slash']
                : ''
            }${tokenRecord.fields['Path']}`,
            permanent: false
          }
        }
      else
        return {
          notFound: true
        }
    } catch {
      nookies.destroy(ctx, 'authToken')
    }
  }
  return { notFound: true }
}
