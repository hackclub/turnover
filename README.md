## TODO

- [ ] `invite.js`
- [ ] Everything inside `[application]/[leader]`

* Club turnover workflow
  * Something like turnover.hackclub.com
  * Every year, probably around March (?) we have an Airtable automation that looks through all the club leaders and their birthdays to determine if they're graduating. Email is sent out to those who are planning to graduate (cc'ing Holly ofc), just being like, "Hey! It looks like you could potentially be graduating this year. Is there anyone you'd like to turn your club over to?" and give them an application link to the transfer application
  * If they are planning to turnover, they can head to the application link and invite the new prospective leaders. This will send out an email to them
  * The new prospective leaders can then fill out the form, similar to how the application one worked
  * Once all the leaders that the old leader (soon to be alum!) has filled out, their info will go directly in Airtable, probably onto the Application Tracker table under a new status (something like "onboarding")

Meeting:

* A better application viewer (personally)
* Update the toolbox per Kara's comments
* Update the apply form with the popup
* Work on transfer
  * Which ones are in active use?
  * Changes to make to Airtable
    * Add status change to Airtable in `Application Tracker` and `Application Database` - "turnover" (perhaps new view in `Application Database` as well?)
    * After turnover gets approved, we need to update Active Emails based on what I've seen 

# Hack Club Transfer

Apply to [Hack Club](https://hackclub.com), built with [React](https://reactjs.org) and [Next.js](https://nextjs.org).

## Setup

1. Clone this repository and enter it

```
git clone https://github.com/hackclub/transfer.git
cd transfer
```

2. Install packages & run

```
yarn && yarn run dev
```

3. It should now be running, open [localhost:3000](http://localhost:3000) to view it.

## Contributing

### How do I add a language?