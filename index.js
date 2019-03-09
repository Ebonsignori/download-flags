const fakeUa = require('fake-useragent')
const request = require('request')
const fs = require('fs-extra')

// Config
const saveDirectory = './flags'
const countries = ['United States of America', 'Japan', 'Canada', 'New Zealand', 'Russia', 'Sweden', 'Zimbabwe', 'Italy', 'South Africa',
  'Pakistan', 'China', 'Saudi Arabia', 'Singapore', 'India', 'Turkey', 'Vietnam', 'Israel', 'Belgium', 'Norway', 'France',
  'Spain', 'Greece', 'Ireland', 'Germany', 'United Kingdom', 'Switzerland', 'Brazil', 'Argentina', 'Venezuela', 'Mexico',
  'Trinidad and Tobago', 'Australia']
const imageExtension = 'png'

const headers = { 'User-Agent': fakeUa() }
const errors = []

async function main () {
  try {
    fs.ensureDir(saveDirectory)
    console.log(`Created directory ${saveDirectory}`)
  } catch (err) {
    console.error(`Unable to create directory: ${saveDirectory}`)
  }

  for (const country of countries) {
    await request.get({ url: flagUrl(country), headers: headers, encoding: 'binary' }, async (fetchError, r, body) => {
      if (fetchError) errors.push({ image: country, error: fetchError, type: 'fetch' })

      try {
        await fs.writeFile(`${saveDirectory}/${normalizeName(country)}.${imageExtension}`, body, 'binary')
        console.log(`Saved flag for ${country}`)
      } catch (writeError) {
        errors.push({ image: country, error: writeError, type: 'write' })
      }
    })
  }

  if (errors.length > 0) {
    console.error('Errors occurred while fetching images.')
    console.log(errors)
  }
}

// Entry point
main()

function flagUrl (country) {
  return `https://www.countries-ofthe-world.com/flags-normal/flag-of-${normalizeName(country)}.${imageExtension}`
}

function normalizeName (country) {
  return country.split(' ').join('-')
}
