import {
  prospectiveLeadersAirtable,
  loginsAirtable,
  turnoverAirtable
} from '../../lib/airtable'

export default async function handler(req, res) {
  try {
    const firstAirtableCall = await prospectiveLeadersAirtable.read({
      maxRecords: 1,
      filterByFormula: `Email = "${decodeURIComponent(req.query.email)}"`
    })

    if (firstAirtableCall.length > 0) {
      const prospectiveLeadersRecord = firstAirtableCall[0]
      const loginRecord = await loginsAirtable.create({
        'Relevant User': [prospectiveLeadersRecord.id],
        Type: 'Turnover',
        Locale: req.query.locale
      })
      res.json({ success: true, id: loginRecord.id })
    } else {
      let today = new Date().toLocaleDateString()
      const turnoverRecord = await turnoverAirtable.create({
        'Turnover Date': today
      })
      const prospectiveLeadersRecord = await prospectiveLeadersAirtable.create({
        Email: decodeURIComponent(req.query.email),
        Turnover: [turnoverRecord.id]
      })
      const loginRecord = await loginsAirtable.create({
        'Relevant User': [prospectiveLeadersRecord.id],
        Type: 'Turnover',
        Locale: req.query.locale
      })
      res.json({ success: true, id: loginRecord.id })
    }
  } catch (error) {
    console.log(error)
    res.status(504).json({ success: false, error })
  }
}
