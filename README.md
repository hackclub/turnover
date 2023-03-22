# Hack Club Transfer

Transfer flow for [Hack Club](https://hackclub.com), built with [React](https://reactjs.org) and [Next.js](https://nextjs.org).

## The turnover flow

1. In March, we have an automation that runs, sending out an email to all potential alumni - that is, anybody who is planning to graduate that year, per the information they entered when they filled out the form at [apply.hackclub.com](https://apply.hackclub.com). 
2. This email contains a login link to [turnover.hackclub.com](https://turnover.hackclub.com). If the alumni plans on turning over their club, this is the form to fill out! All you need to do is:
   1. Talk to your club/club leaders about who would be a great fit.
   2. Send an email invite to them using the application at the login link!
3. Once you've invited the future leaders, you're all set!

For future leaders: 

1. You'll receive an email with a login link to [turnover.hackclub.com](https://turnover.hackclub.com).
2. Fill out the information in the application at the login link! You'll also get a chance to invite fellow coleaders. This is basically just like [apply.hackclub.com](https://apply.hackclub.com), but for getting a club turned over.
3. You and your fellow team leaders will receive an email to set up a meeting to discuss how Hack Club can help you run a successful, well, Hack Club!

That's all!

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

Fork this repo, go into the `translations` repo, and add a new file `<locale>.js`. Follow the same pattern as `en-US.js`, like so:

```javascript
export const messageObject = {
   SOME_TERM: "<Translation>",
   ...
}
```

Once you're done, make sure you open up a pull request!