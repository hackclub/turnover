import { loginsAirtable, prospectiveLeadersAirtable } from '../../lib/airtable'
import nookies from 'nookies'

export default async function handler(req, res) {
  const cookies = nookies.get({ req })
  try {
    const tokenRecord = await loginsAirtable.find('rec' + cookies.authToken)
    if (!tokenRecord.fields['Path'][0].split('/')[0].includes(req.query.id)) {
      res.redirect('/')
      return
    }
    const deleteCall = await prospectiveLeadersAirtable.delete(
      req.query.leaderID
    )
    res.status(200).json({ success: true, res: deleteCall })
  } catch (error) {
    res.status(504).json({ success: false, error })
  }
}
