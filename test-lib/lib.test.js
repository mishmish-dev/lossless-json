import { strictEqual } from 'node:assert'
import cp from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, test } from 'vitest'

describe('lib', () => {
  test('should load the library using ESM', () =>
    new Promise((resolve) => {
      const filename = path.join(__dirname, 'apps/esmApp.mjs')

      cp.exec(`node ${filename}`, (error, result) => {
        strictEqual(error, null)
        strictEqual(
          result,
          '9223372036854775827\n' + '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}\n'
        )
        resolve()
      })
    }))

  test('should load the library using UMD bundle', () =>
    new Promise((resolve) => {
      const filename = path.join(__dirname, 'apps/umdApp.cjs')

      cp.exec(`node ${filename}`, (error, result) => {
        strictEqual(error, null)
        strictEqual(
          result,
          '9223372036854775827\n' + '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}\n'
        )
        resolve()
      })
    }))
})

test('recognizes and serializes LosslessNumbers across ESM and UMD bundles', async () => {
  const esm = await import('../lib/esm/index.js')
  const umd = createRequire(import.meta.url)('../lib/umd/lossless-json.js')
  const token = '9007199254740993'
  for (const [reader, writer] of [
    [esm, umd],
    [umd, esm]
  ]) {
    const value = new writer.LosslessNumber(token)
    strictEqual(reader.isLosslessNumber(value), true)
    strictEqual(reader.stringify(value), token)
    let calls = 0
    reader.parse(
      token,
      (_key, parsed) => {
        calls++
        return parsed
      },
      () => value
    )
    strictEqual(calls, 1)
  }
})
