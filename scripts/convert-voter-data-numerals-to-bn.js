#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Converts any ASCII digits (0-9) found inside string values in `public/voter_data.json`
 * into Bengali digits (০-৯), EXCEPT `wardNo` which is kept as an English number for routing.
 *
 * Also normalizes `wardNo` if it is currently a string (Bengali/English digits) back to a number.
 */

const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const dataPath = path.join(ROOT, 'public', 'voter_data.json')

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function toBengaliDigitsInString(value) {
  return value.replace(/[0-9]/g, (d) => bnDigits[d.charCodeAt(0) - 48])
}

function toEnglishDigitsInString(value) {
  return value.replace(/[০-৯]/g, (d) => {
    const idx = bnDigits.indexOf(d)
    return idx === -1 ? d : enDigits[idx]
  })
}

function convert(value) {
  if (typeof value === 'string') return toBengaliDigitsInString(value)
  if (Array.isArray(value)) return value.map(convert)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === 'wardNo') {
        if (typeof v === 'number' && Number.isFinite(v)) {
          out[k] = v
          continue
        }
        if (typeof v === 'string') {
          const normalized = toEnglishDigitsInString(v).trim()
          const n = Number.parseInt(normalized, 10)
          out[k] = Number.isFinite(n) ? n : v
          continue
        }
      }
      out[k] = convert(v)
    }
    return out
  }
  return value
}

function main() {
  const raw = fs.readFileSync(dataPath, 'utf8')
  const parsed = JSON.parse(raw)
  const converted = convert(parsed)

  const next = JSON.stringify(converted, null, '\t') + '\n'
  fs.writeFileSync(dataPath, next, 'utf8')

  console.log('Updated:', path.relative(ROOT, dataPath))
}

main()
