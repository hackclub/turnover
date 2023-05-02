import {
  prospectiveLeadersAirtable,
  loginsAirtable,
  applicationAirtable,
  turnoverAirtable
} from '@/lib/airtable'
import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'

const doNotSend = [
  'vedantkakde651@gmail.com',
  'me@devenjadhav.com',
  'aditya.birangal@gmail.com',
  'shivam_1901cs55@iitp.ac.in',
  'sushreesatarupa.ss@gmail.com',
  'shafkhattak1993@gmail.com',
  'sanskrutipunde501@gmail.com',
  'blucashbaugh@gmail.com',
  'nirajnad@gmail.com',
  'kumarashwin2603@gmail.com',
  'brahimi.zakaria.abdessamed@gmail.com',
  'rsaka.23@desales.co',
  'Beingamit4197@gmail.com',
  'sarandevnet@gmail.com',
  'vtu15511@veltech.edu.in',
  'py.priybhashsoni@gmail.com',
  'sevara.f520@slcstudents.org',
  'souveekroy14@gmail.com',
  '19btcse33@suiit.ac.in',
  'ohmsingh100@gmail.com',
  'yash9785115297@gmail.com',
  'dubeyavanish166@gmail.com',
  'varanasiroshan31011@gmail.com',
  'riyadevvarshney11@gmail.com',
  'sharmasheetal01761@gmail.com',
  'jayeshdhuri25@gmail.com',
  'blnp4@k12albemarle.org',
  'abhisheksharma86490@gmail.com'
]

// Vercel cron job to send email
export default async function handler(req, res) {
  // Make sure appropriate date
  const today = new Date()
  if (
    !(
      today.getMonth() === 3 &&
      today.getDay() === 1 &&
      today.getHours() === 12 &&
      today.getMinutes() === 0 &&
      today.getSeconds() === 0
    )
  )
    return res.status(404).json({
      message: 'Inappropriate timing to run'
    })
  const graduatingThisYear = await prospectiveLeadersAirtable.read({
    filterByFormula: `{School Year} = "${today.getFullYear()}"`
  })
  let sentEmailTo = []
  try {
    await graduatingThisYear.map(async (leader, idx) => {
      if (!doNotSend.includes(leader.fields.Email)) {
        try {
          const apply = await applicationAirtable.find(
            leader.fields['Application ID'][0]
          )
          const president = apply.fields['President']
          if (['undefined', '', leader.fields.Email].includes(president)) {
            // Send email, log to text file for easy searching
            sentEmailTo.push(leader.fields.Email)
            await loginsAirtable.create({
              Type: 'Turnover Invite',
              'Relevant User': [leader.id]
            })
            const turnover = await turnoverAirtable.create({
              'Turnover Date': dayjs(new Date().toString()).format(
                'MM/DD/YYYY'
              ),
              Alumni: leader.fields.Email,
              'School Address': apply.fields['School Address'],
              'School Name': apply.fields['School Name'],
              'What Is New': 'Begin turnover flow',
              'Venue Type': apply.fields['Venue Type'],
              'Application ID': [apply.id],
              'Prospective Leaders': []
            })
            await prospectiveLeadersAirtable.update(leader.id, {
              Turnover: [turnover.id]
            })
          }
        } catch (err) {
          console.log('Error running: ', err.message)
        }
      }
    })
    // Open file and write graduatingThisYear to it
    fs.writeFile(
      path.join(process.cwd(), 'graduating.txt'),
      sentEmailTo.join('\n'),
      err => {
        console.log(err)
      }
    )
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    console.log(err.message)
  } finally {
    fs.writeFile(
      path.join(process.cwd(), 'graduating.txt'),
      sentEmailTo.join('\n'),
      err => {
        return res.status(500).json({
          err
        })
      }
    )
  }
  return res.status(200)
}
