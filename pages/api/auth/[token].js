import { loginsAirtable, turnoverAirtable } from '../../../lib/airtable'
import nookies from 'nookies'

export default async function handler(req, res) {
  try {
    const tokenRecord = await loginsAirtable.find('rec' + req.query.token)
    if (
      !tokenRecord ||
      !tokenRecord.fields['Path'] ||
      !['Turnover Invite', 'Turnover'].includes(tokenRecord.fields['Type'])
    )
      return res.redirect('/')
    else if (tokenRecord.fields['Path']) {
      const authType = tokenRecord.fields['Type']
      nookies.set({ res }, 'authToken', req.query.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      })
      nookies.set({ res }, 'authType', authType, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      })
      // ... Make sure that the user isn't alumni
      const turnover = await turnoverAirtable.read({
        filterByFormula: `{Alumni} = "${tokenRecord.fields['Email']}"`,
        maxRecords: 1
      })
      if (turnover.length > 0)
        return res.redirect(
          `/${tokenRecord.fields['Locale with a slash'] || ''}${
            tokenRecord.fields['Path'] || ''
          }`
        )
      else
        return res.redirect(
          `/${tokenRecord.fields['Locale with a slash'] || ''}/turnover/${
            tokenRecord.fields['Path'] || ''
          }`
        )
    }
    res.redirect('/')
  } catch (err) {
    console.log(err)
    return res.redirect('/')
  }
}
