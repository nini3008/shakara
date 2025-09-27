import {writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {schemaTypes} from '../schemaTypes'

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitize)
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (typeof val === 'function') continue
      if (key === 'validation' || key === 'prepare') continue
      result[key] = sanitize(val)
    }
    return result
  }
  return value
}

const exported = {
  generatedAt: new Date().toISOString(),
  types: schemaTypes.map((t: any) => ({
    name: t.name,
    title: t.title,
    type: t.type,
    fields: sanitize(t.fields || []),
    options: sanitize(t.options || {}),
    orderings: sanitize(t.orderings || []),
  })),
}

const outPath = resolve(process.cwd(), 'schema-export.json')
writeFileSync(outPath, JSON.stringify(exported, null, 2), 'utf-8')
console.log(`Wrote ${outPath}`)


