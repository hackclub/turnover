export default {
  clubs: [
    {
      header: 'Leaders',
      translations: {},
      items: [
        {
          key: 'President',
          label: 'Who should we reach out to?',
          type: 'select',
          optionsKey: 'Leaders Emails',
          optional: false
        },
        {
          key: 'Leaders Relationship',
          label:
            'How long have you known your other club leaders and how did you meet?',
          type: 'paragraph',
          optional: true,
          words: 50
        }
      ]
    },
    {
      header: 'Venue',
      translations: {},
      items: [
        {
          key: 'Venue Type',
          label: 'What type of venue will your Hack Club take place in?',
          type: 'select',
          placeholder: 'Happy Hack High School',
          options: [
            'High School',
            'College/University',
            'Makerspace',
            'Something Else'
          ],
          optional: false
        },
        {
          key: 'School Name',
          label: "What's the name of your venue?",
          sublabel:
            "(It doesn't have to be a high school! Instead, you can also add the name of your makerspace here)",
          placeholder: 'Happy Hack High School',
          type: 'string',
          optional: false
        },
        {
          key: 'School Address',
          label: `What's the full address?`,
          type: 'paragraph',
          optional: false,
          sublabel: 'City, State / Province, Postal Code, Country'
        }
      ]
    },
    {
      header: 'Idea',
      label: (
        <span style={{ fontSize: '20px' }}>
          Answer these questions so we can personalize your club experience.
        </span>
      ),
      items: [
        {
          key: 'Success',
          label: 'What does a successful club look like to you?',
          type: 'paragraph',
          translations: {},
          optional: false,
          words: 75
        },
        {
          key: 'Get Out Of HC',
          label: 'What do you personally hope to get out of Hack Club?',
          type: 'paragraph',
          optional: false,
          words: 75
        }
      ]
    }
  ],
  leaders: [
    {
      header: 'Leader',
      translations: {},
      items: [
        {
          key: 'Full Name',
          label: 'Full Name',
          type: 'string',
          translations: {},
          optional: false
        },
        {
          key: 'Birthday',
          label: 'Birthday',
          type: 'string',
          inputType: 'date',
          translations: {},
          optional: false
        },
        {
          key: 'School Year',
          label: 'Graduation Year',
          type: 'string',
          translations: {},
          optional: false
        },
        {
          key: 'Code',
          type: 'string',
          inputType: 'tel',
          translations: {},
          optional: false
        },
        {
          key: 'Phone',
          type: 'string',
          inputType: 'tel',
          translations: {},
          optional: false
        },
        {
          key: 'Address',
          label: 'Your full address (where we can ship you stickers)',
          type: 'paragraph',
          translations: {},
          optional: false,
          sublabel: 'City, State / Province, Postal Code, Country'
        }
      ]
    },
    {
      header: 'Presence',
      translations: {},
      items: [
        {
          key: 'Website',
          label: 'Personal website link',
          placeholder: 'https://',
          type: 'string',
          translations: {},
          optional: true
        },
        {
          key: 'GitHub',
          label: 'GitHub link',
          placeholder: 'https://',
          type: 'string',
          translations: {},
          optional: true
        },
        {
          key: 'Twitter',
          label: 'Twitter link',
          placeholder: 'https://',
          type: 'string',
          translations: {},
          optional: true
        },
        {
          key: 'Other',
          label: 'Other Technical Links',
          placeholder: 'https://',
          type: 'string',
          sublabel: '(Gitlab, Sourcehut, other site where your code lives)',
          translations: {},
          optional: true
        }
      ]
    },
    {
      header: 'Skills',
      header: 'Hacker Details',
      label:
        "We want to get to know you! Please answer these questions like you're telling them to a friend",
      translations: {},
      items: [
        {
          key: 'Achievement',
          label:
            'Tell us about something you made which was personally meaningful to you?',
          type: 'paragraph',
          translations: {},
          optional: false,
          sublabel: '(include links and links to images if possible)',
          characters: [150, 250]
        },
        {
          key: 'New Fact',
          label:
            'What is something surprising or amusing you learned recently?',
          type: 'paragraph',
          translations: {},
          optional: false,
          characters: [50, 400],
          sublabel:
            "Don't make it about Hack Club! Doesn't have to be about coding."
        },
        {
          key: 'Hacker Story',
          label: (
            <>
              Please tell us about the time you most successfully hacked some
              (non-computer) system to your advantage.{' '}
              <a
                href="https://www.quora.com/When-have-you-most-successfully-hacked-a-non-computer-system-to-your-advantage"
                style={{ color: '#338eda' }}
                target="_blank"
              >
                Here are examples of what we&#39;re looking for
              </a>
              .
            </>
          ),
          translations: {},
          plainText:
            'Please tell us about the time you most successfully hacked some (non-computer) system to your advantage.',
          type: 'paragraph',
          optional: false,
          characters: [450, 1200]
        }
      ]
    },
    {
      header: 'Optional Stats',
      label:
        'We care about being as inclusive as possible. Sharing this information helps us achieve this goal.',
      translations: {},
      items: [
        {
          key: 'Gender',
          label: 'Gender',
          optional: true,
          type: 'select',
          options: [
            'Male',
            'Female',
            'Non-binary/non-conforming',
            'Prefer not to respond'
          ]
        },
        {
          key: 'Ethnicity',
          label: 'Ethnicity',
          type: 'select',
          translations: {},
          options: [
            'Hispanic, Latino or Spanish origin',
            'White',
            'Black, African American',
            'American Indian or Alaska native',
            'Asian',
            'Asian Indian',
            'Native Hawaiian or Other Pacific Islander',
            'Other Ethnicity',
            'Prefer not to say'
          ],
          optional: true
        }
      ]
    }
  ],
  metaData: {
    maximumAge: 20 /* IN YEARS */
  }
}
