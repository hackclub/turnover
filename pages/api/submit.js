import {
  turnoverAirtable,
  loginsAirtable,
  trackerAirtable,
  applicationAirtable,
  prospectiveLeadersAirtable,
  clubsAirtable
} from '../../lib/airtable'
import nookies from 'nookies'

export default async function handler(req, res) {
  const cookies = nookies.get({ req })
  try {
    const tokenRecord = await loginsAirtable.find('rec' + cookies.authToken)
    if (!tokenRecord.fields['Path'][0].includes(req.query.id))
      return res.redirect('/')
    const turnoverRecord = await turnoverAirtable.find('rec' + req.query.id)
    // Move Application from old to new "president", update manual fields
    const alumni = (
      await prospectiveLeadersAirtable.read({
        filterByFormula: `{Email} = "${turnoverRecord.fields['Alumni']}"`,
        maxRecords: 1
      })
    )[0]
    const applicationId = alumni.fields['Application'][0]
    console.log(alumni.fields['Application'])
    const application = await applicationAirtable.find(applicationId)
    console.log(application)
    const applicationVenue = application.fields['School Name']

    // Update Turnover Database
    await turnoverAirtable.updateWhere(
      `{Turnover ID} = ${'rec' + req.query.id}`,
      {
        Submitted: true
      }
    )

    // Update Application Tracker
    await trackerAirtable.updateWhere(`{Venue} = "${applicationVenue}"`, {
      Venue: turnoverRecord.fields['School Name'],
      'Leader Address': turnoverRecord.fields['Leader Address'],
      'Leader(s)': turnoverRecord.fields['Full Name'],
      Status: 'turnover',
      "Leaders' Emails": turnoverRecord.fields['Leaders Emails'].join(','),
      Location: turnoverRecord.fields['School Address'],
      'Leader Phone': turnoverRecord.fields['Leader Phone'],
      Applied: turnoverRecord.fields['Turnover Date'],
      'Turnover Database': turnoverRecord.id,
      Notes: 'Leader applied for turnover'
    })

    // Update Clubs Dashboard
    await clubsAirtable.updateWhere(`{Venue} = "${applicationVenue}"`, {
      Venue: turnoverRecord.fields['School Name'],
      'Current Leader(s)': turnoverRecord.fields['Full Name'].join(','),
      'Leader Address': turnoverRecord.fields['Leader Address'].join(','),
      "Current Leaders' Emails":
        turnoverRecord.fields['Leaders Emails'].join(','),
      Location: turnoverRecord.fields['School Address'],
      'Leader Phone': turnoverRecord.fields['Leader Phone'].join(',')
    })

    return res.status(200).json({ success: true, id: application.id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error })
  }
}
