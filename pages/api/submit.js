import {
  turnoverAirtable,
  loginsAirtable,
  trackerAirtable,
  applicationAirtable,
  prospectiveLeadersAirtable
} from '../../lib/airtable'
import nookies from 'nookies'

export default async function handler(req, res) {
  const cookies = nookies.get({ req })
  try {
    const tokenRecord = await loginsAirtable.find('rec' + cookies.authToken)
    if (!tokenRecord.fields['Path'][0].includes(req.query.id))
      return res.redirect('/')
    const turnoverRecord = await turnoverAirtable.find('rec' + req.query.id)

    // Move Application from old to new "president", update manual fields (President)
    const alumni = await prospectiveLeadersAirtable.find(
      turnoverRecord.fields['Prospective Leaders'][0]
    )
    const applicationId = 'recLaxZ1uyjM6P9DB' //alumni.fields.Application[0]
    const application = await applicationAirtable.find(applicationId)
    const applicationVenue = application.fields['School Name']
    /*
    await prospectiveLeadersAirtable.update(alumni.id, {
      Application: []
    })

    await prospectiveLeadersAirtable.update(
      turnoverRecord.fields['Prospective Leaders'][1],
      {
        Application: [applicationId]
      }
    )
    */

    // Update Application Tracker
    await trackerAirtable.updateWhere(`{Venue} = "${applicationVenue}"`, {
      Venue: turnoverRecord.fields.Venue,
      'Leader Address': turnoverRecord.fields['Leader Address'][0],
      'Leader(s)': turnoverRecord.fields['Leaders'],
      Status: 'turnover',
      "Leaders' Emails": turnoverRecord.fields['Leaders Emails'].join(','),
      Location: turnoverRecord.fields['Location'],
      'Leader Phone': turnoverRecord.fields['Leader Phone'][0],
      Applied: turnoverRecord.fields['Turnover Date'],
      'Turnover Database': turnoverRecord.id
    })

    // TODO: Update Clubs Dashboard

    return res.status(200).json({ success: true, id: application.id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error })
  }
}
