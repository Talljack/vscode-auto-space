import { describe, expect, it } from 'vitest'
import { customSpacing } from '../src/handler'

describe('customSpacing', () => {
  it('test English and Chinese', () => {
    let result = customSpacing (' 你好Hello World，这是一个test')
    expect (result).toBe(' 你好 Hello World，这是一个 test')
    result = customSpacing (' 你好Hello World这也是一个test')
    expect (result).toBe(' 你好 Hello World 这也是一个 test')
  })

  it('test English and Chinese multiple line', () => {
    let result = customSpacing (' 你好Hello World，这是一个test\n 你好Hello World，这是一个test')
    expect (result).toBe(' 你好 Hello World，这是一个 test\n 你好 Hello World，这是一个 test')
    result = customSpacing (' 你好Hello World，这是一个test\n 你好Hello World，这是一个test\n 你好Hello World，这是一个test')
    expect (result).toBe(' 你好 Hello World，这是一个 test\n 你好 Hello World，这是一个 test\n 你好 Hello World，这是一个 test')
  })

  it('test English and EN_PUNCT', () => {
    let result = customSpacing ('console.log("中文测试")')
    expect (result).toBe('console.log("中文测试")')
    result = customSpacing ('console.log("EN_PUNCT中文测试")')
    expect (result).toBe('console.log("EN_PUNCT 中文测试")')
    result = customSpacing ('console.log{"EN_PUNCT中文测试"}')
    expect (result).toBe('console.log{"EN_PUNCT 中文测试"}')
    result = customSpacing ('console.log["EN_PUNCT中文测试"]')
    expect (result).toBe('console.log["EN_PUNCT 中文测试"]')
  })
  it('test Chinese and EN_PUNCT', () => {
    let result = customSpacing ('中文测试(EN_PUNCT)')
    expect (result).toBe('中文测试 (EN_PUNCT)')
    result = customSpacing ('中文测试console.log("EN_PUNCT中文测试")')
    expect (result).toBe('中文测试 console.log("EN_PUNCT 中文测试")')
    result = customSpacing ('中文测试console.log{"EN_PUNCT中文测试"}')
    expect (result).toBe('中文测试 console.log{"EN_PUNCT 中文测试"}')
    result = customSpacing ('中文测试console.log["EN_PUNCT中文测试"]')
    expect (result).toBe('中文测试 console.log["EN_PUNCT 中文测试"]')
  })

  it('test English and EN_PUNCT', () => {
    let result = customSpacing ('中文测试（中文English）')
    expect (result).toBe('中文测试（中文 English）')
    result = customSpacing ('中文测试console.log（"中文English中文测试"）')
    expect (result).toBe('中文测试 console.log（"中文 English 中文测试"）')
    result = customSpacing ('中文测试console.log 【"中文English中文测试"】')
    expect (result).toBe('中文测试 console.log 【"中文 English 中文测试"】')
  })

  it('test Chinese and EN_PUNCT', () => {
    let result = customSpacing ('中文测试（中文English）')
    expect (result).toBe('中文测试（中文 English）')
    result = customSpacing ('中文测试console.log「"中文English中文测试"」')
    expect (result).toBe('中文测试 console.log「"中文 English 中文测试"」')
    result = customSpacing ('中文测试console.log 【"中文English中文测试"】')
    expect (result).toBe('中文测试 console.log 【"中文 English 中文测试"】')
  })

  it('test code', () => {
    let result = customSpacing ('console.log("中文测试")')
    expect (result).toBe('console.log("中文测试")')
    // fix: https://github.com/Talljack/vscode-auto-space/issues/241
    result = customSpacing('exec() 你好()')
    expect (result).toBe('exec() 你好 ()')
    // fix: https://github.com/Talljack/vscode-auto-space/issues/214
    result = customSpacing('new IllegalArgumentException("非法下标参数")')
    expect (result).toBe('new IllegalArgumentException("非法下标参数")')
    result = customSpacing('target = 18, int[] nums = [1, 5, 7, 11], 循环三次的map结果是{1 = 0, 5 = 1, 7 = 2 }')
    expect (result).toBe('target = 18, int[] nums = [1, 5, 7, 11], 循环三次的 map 结果是 {1 = 0, 5 = 1, 7 = 2 }')
    result = customSpacing('const a: number = 1, const b: string = "123"')
    expect (result).toBe('const a: number = 1, const b: string = "123"')
    result = customSpacing('type A<T> = { a: T, b: T }; const a = [1, 2, 3]')
    expect (result).toBe('type A<T> = { a: T, b: T }; const a = [1, 2, 3]')
    result = customSpacing('const a = {a: "1", b: 3 }')
    expect (result).toBe('const a = {a: "1", b: 3 }')
  })
})
