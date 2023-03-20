import { loginsAirtable } from '../../../lib/airtable'
import nookies from 'nookies'

export default async function handler(req, res) {
  try {
    const tokenRecord = await loginsAirtable.find('rec' + req.query.token)
    if (tokenRecord.fields['Path']) {
      nookies.set({ res }, 'authToken', req.query.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      })
      const authType = tokenRecord.fields['Type']
      if (!['Turnover Invite', 'Turnover'].includes(authType))
        return res.redirect('/')
      nookies.set({ res }, 'authType', authType, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      })
      if (authType === 'Turnover Invite')
        return res.redirect(
          `/${
            tokenRecord.fields['Locale with a slash']
              ? tokenRecord.fields['Locale with a slash']
              : ''
          }${tokenRecord.fields['Path'] ? tokenRecord.fields['Path'] : ''}`
        )
      return res.redirect(
        `/${
          tokenRecord.fields['Locale with a slash']
            ? tokenRecord.fields['Locale with a slash']
            : ''
        }/turnover/${
          tokenRecord.fields['Path'] ? tokenRecord.fields['Path'] : ''
        }`
      )
    }
    res.redirect('/')
  } catch {
    res.redirect('/')
  }
}
