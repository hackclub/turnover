const AirtablePlus = require('airtable-plus')

const API_KEY = process.env.AIRTABLE

export const prospectiveLeadersAirtable = new AirtablePlus({
  baseID: 'appSUAc40CDu6bDAp',
  apiKey: API_KEY,
  tableName: 'Prospective Leaders'
})

export const loginsAirtable = new AirtablePlus({
  baseID: 'appSUAc40CDu6bDAp',
  apiKey: API_KEY,
  tableName: 'Logins'
})

export const turnoverAirtable = new AirtablePlus({
  baseID: 'appSUAc40CDu6bDAp',
  apiKey: API_KEY,
  tableName: 'Turnover Database'
})

export const applicationAirtable = new AirtablePlus({
  baseID: 'appSUAc40CDu6bDAp',
  apiKey: API_KEY,
  tableName: 'Application Database'
})

export const trackerAirtable = new AirtablePlus({
  baseID: 'appSUAc40CDu6bDAp',
  apiKey: API_KEY,
  tableName: 'Application Tracker'
})

export const clubsAirtable = new AirtablePlus({
  baseID: 'appSUAc40CDu6bDAp',
  apiKey: API_KEY,
  tableName: 'Clubs Dashboard'
})
