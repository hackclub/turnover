import {
  turnoverAirtable,
  loginsAirtable,
  trackerAirtable,
  applicationAirtable,
  prospectiveLeadersAirtable,
  clubsAirtable
} from '../../lib/airtable'
import nookies from 'nookies'
import { isInvalidBirthdate } from '@/lib/helpers'
import dayjs from 'dayjs'

export default async function handler(req, res) {
  const cookies = nookies.get({ req })
  try {
    const tokenRecord = await loginsAirtable.find('rec' + cookies.authToken)
    if (!tokenRecord.fields['Path'][0].includes(req.query.id))
      return res.redirect('/')
    const turnoverRecord = await turnoverAirtable.find('rec' + req.query.id)
    if (
      isInvalidBirthdate(
        turnoverRecord.fields['Leader Birthdays'][1],
        turnoverRecord.fields['Leader Birthdays'] || []
      )
    )
      throw new Error('Invalid birthdates')
    // Move Application from old to new "president", update manual fields
    const alumni = (
      await prospectiveLeadersAirtable.read({
        filterByFormula: `{Email} = "${turnoverRecord.fields['Alumni']}"`,
        maxRecords: 1
      })
    )[0]
    const applicationId = alumni.fields['Application'][0]
    const application = await applicationAirtable.find(applicationId)
    const applicationVenue = application.fields['School Name']

    // Update Turnover Database
    await turnoverAirtable.update('rec' + req.query.id, {
      Submitted: true
    })

    if (
      !(
        await trackerAirtable.read({
          filterByFormula: `{Venue} = "${applicationVenue}"`,
          maxRecords: 1
        })
      ).length
    ) {
      // Club doesn't exist in toolbox yet
      await trackerAirtable.create({
        Venue: turnoverRecord.fields['School Name'],
        'Leader Address': turnoverRecord.fields['Leader Address'].join(','),
        'Leader(s)': turnoverRecord.fields['Full Name'].join(','),
        Status: 'turnover',
        "Leaders' Emails": turnoverRecord.fields['Leaders Emails'].join(','),
        Location: turnoverRecord.fields['School Address'],
        'Leader Phone': turnoverRecord.fields['Leader Phone'].join(','),
        Applied: turnoverRecord.fields['Turnover Date'],
        'Turnover Database': turnoverRecord.id,
        Notes: 'Leader applied for turnover',
        'Date Responded': dayjs(new Date().toString()).format('MM/DD/YYYY')
      })
    } else {
      // Update Application Tracker
      await trackerAirtable.updateWhere(`{Venue} = "${applicationVenue}"`, {
        Venue: turnoverRecord.fields['School Name'],
        'Leader Address': turnoverRecord.fields['Leader Address'].join(','),
        'Leader(s)': turnoverRecord.fields['Full Name'].join(','),
        Status: 'turnover',
        "Leaders' Emails": turnoverRecord.fields['Leaders Emails'].join(','),
        Location: turnoverRecord.fields['School Address'],
        'Leader Phone': turnoverRecord.fields['Leader Phone'].join(','),
        Applied: turnoverRecord.fields['Turnover Date'],
        'Turnover Database': turnoverRecord.id,
        Notes: 'Leader applied for turnover',
        'Date Responded': dayjs(new Date().toString()).format('MM/DD/YYYY')
      })

      // Update Clubs Dashboard
      // Note: Actually, this involves removing the old venue from the club dashboard
      await clubsAirtable.deleteWhere(`{Venue} = "${applicationVenue}"`)
    }

    return res.status(200).json({ success: true, id: application.id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, error })
  }
}
