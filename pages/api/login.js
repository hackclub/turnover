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

      return res.json({ success: true, id: loginRecord.id })
    }
    throw new Error("User doesn't exist")
  } catch (err) {
    console.log(err)
    res.status(504).json({ success: false, err })
  }
}
