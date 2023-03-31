import { prospectiveLeadersAirtable, loginsAirtable } from '../../lib/airtable'
import nookies from 'nookies'

export default async function handler(req, res) {
  const cookies = nookies.get({ req })
  try {
    const tokenRecord = await loginsAirtable.find('rec' + cookies.authToken)
    if (!tokenRecord.fields['Path'][0].split('/')[0].includes(req.query.id)) {
      res.redirect('/')
      return
    }

    let prospectiveLeadersRecord = await prospectiveLeadersAirtable.read({
      filterByFormula: `{Email} = "${req.query.email}"`,
      maxRecords: 1
    })
    if (prospectiveLeadersRecord.length) {
      // Check if prospective leader already exists
      // If so, update directly
      prospectiveLeadersRecord = await prospectiveLeadersAirtable.update(
        prospectiveLeadersRecord.id,
        {
          'Turnover Invite?': true
        }
      )
    } else {
      prospectiveLeadersRecord = await prospectiveLeadersAirtable.create({
        Email: decodeURIComponent(req.query.email),
        Turnover: ['rec' + req.query.id],
        'Turnover Invite?': true
      })
    }
    const loginRecord = await loginsAirtable.create({
      'Relevant User': [prospectiveLeadersRecord.id],
      'New Invite': true,
      Locale: req.query.locale,
      Type: 'Turnover'
    })
    res.json({ success: true, id: loginRecord.id })
  } catch (error) {
    console.log(error)
    res.status(504).json({ success: false, error })
  }
}
