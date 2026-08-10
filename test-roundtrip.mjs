import { orgToJson, jsonToOrg } from './server/utils/org.ts'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const notesDir = process.env.TEST_NOTES_DIR || '/home/lunixose/Documents/notes'
function walk(d) {
  const out = []
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.org')) out.push(p)
  }
  return out
}

let pass = 0, fail = 0
for (const f of walk(notesDir)) {
  const src = readFileSync(f, 'utf-8')
  const { header, content } = orgToJson(src)
  const doc = { type: 'doc', content }
  const out = jsonToOrg(doc, header)
  const back = orgToJson(out)
  const h1 = JSON.stringify(header)
  const h2 = JSON.stringify(back.header)
  const title = header.title || f
  if (h1 === h2) { pass++; console.log(`OK  ${title}  header preserved`) }
  else { fail++; console.log(`FAIL ${title}\n  src: ${h1}\n  out: ${h2}`) }
}
console.log(`\n${pass} pass, ${fail} fail`)
