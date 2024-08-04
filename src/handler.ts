// 定义字符类型
const CHAR_TYPE = {
  CN: 'CN',
  EN: 'EN',
  NUM: 'NUM',
  CN_PUNCT: 'CN_PUNCT',
  EN_PUNCT: 'EN_PUNCT',
  MD_SPECIAL: 'MD_SPECIAL',
  SPACE: 'SPACE',
  UNICODE_SYMBOL: 'UNICODE_SYMBOL',
  EMOJI: 'EMOJI',
  OTHER: 'OTHER',
}

// 判断字符类型
/**
 *
 * @param char
 */
function getCharType(char: string) {
  // 中文字符（包括扩展的中文字符集）
  if (/[\u4e00-\u9fa5]/.test(char)) return CHAR_TYPE.CN

  // 英文字符（包括一些特殊的拉丁字母）
  if (/[a-zA-Z]/.test(char)) return CHAR_TYPE.EN

  // 数字（包括全角数字）
  if (/[0-9０-９]/.test(char)) return CHAR_TYPE.NUM

  // 中文标点
  if (/[，。？！、；：’“「」『』（）【】《》〈〉…—～·]/.test(char)) return CHAR_TYPE.CN_PUNCT

  // 英文标点（包括一些特殊符号）
  if (/[,.?!;:()\\[\]{}<>'"_\-+=%$#@&*~`|\\\\/]/.test(char)) return CHAR_TYPE.EN_PUNCT

  // Markdown 特殊字符
  if (/[#*`~>]/.test(char)) return CHAR_TYPE.MD_SPECIAL

  // 空白字符（包括各种空格、制表符、换行符等）
  if (/\s/.test(char)) return CHAR_TYPE.SPACE

  // 其他 Unicode 字符（如表情符号、特殊符号等）
  if (/[\u2600-\u26FF\u2700-\u27BF\u1F300-\u1F5FF\u1F600-\u1F64F\u1F680-\u1F6FF\u1F900-\u1F9FF]/.test(char)) return CHAR_TYPE.UNICODE_SYMBOL

  // Emoji 检查
  if (/\p{Emoji}/u.test(char)) return CHAR_TYPE.EMOJI
  // 默认情况
  return CHAR_TYPE.OTHER
}
// 判断是否需要在两个字符之间添加空格
/**
 *
 * @param typeA
 * @param typeB
 */
function needSpace(typeA: keyof typeof CHAR_TYPE, typeB: keyof typeof CHAR_TYPE) {
  if (typeA === CHAR_TYPE.SPACE || typeB === CHAR_TYPE.SPACE) return false
  if (typeA === CHAR_TYPE.CN && typeB === CHAR_TYPE.EN) return true
  if (typeA === CHAR_TYPE.EN && typeB === CHAR_TYPE.CN) return true
  if (typeA === CHAR_TYPE.CN && typeB === CHAR_TYPE.NUM) return true
  if (typeA === CHAR_TYPE.NUM && typeB === CHAR_TYPE.CN) return true
  if (typeA === CHAR_TYPE.CN && typeB === CHAR_TYPE.EN_PUNCT) return true
  if (typeA === CHAR_TYPE.EN_PUNCT && typeB === CHAR_TYPE.CN) return true
  if (typeA === CHAR_TYPE.CN_PUNCT && typeB === CHAR_TYPE.EN) return true
  if (typeA === CHAR_TYPE.CN_PUNCT && typeB === CHAR_TYPE.NUM) return true
  if (typeA === CHAR_TYPE.NUM && typeB === CHAR_TYPE.CN_PUNCT) return true
  if (typeA === CHAR_TYPE.UNICODE_SYMBOL && (typeB === CHAR_TYPE.CN || typeB === CHAR_TYPE.EN || typeB === CHAR_TYPE.NUM || typeB === CHAR_TYPE.CN_PUNCT || typeB === CHAR_TYPE.EN_PUNCT || typeB === CHAR_TYPE.EMOJI)) return true
  if ((typeA === CHAR_TYPE.CN || typeA === CHAR_TYPE.EN || typeA === CHAR_TYPE.NUM || typeA === CHAR_TYPE.CN_PUNCT || typeA === CHAR_TYPE.EN_PUNCT || typeA === CHAR_TYPE.EMOJI) && typeB === CHAR_TYPE.UNICODE_SYMBOL) return true
  if (typeA === CHAR_TYPE.EMOJI && (typeB === CHAR_TYPE.CN || typeB === CHAR_TYPE.EN || typeB === CHAR_TYPE.NUM || typeB === CHAR_TYPE.CN_PUNCT || typeB === CHAR_TYPE.EN_PUNCT || typeB === CHAR_TYPE.UNICODE_SYMBOL)) return true
  if ((typeA === CHAR_TYPE.CN || typeA === CHAR_TYPE.EN || typeA === CHAR_TYPE.NUM || typeA === CHAR_TYPE.CN_PUNCT || typeA === CHAR_TYPE.EN_PUNCT || typeA === CHAR_TYPE.UNICODE_SYMBOL) && typeB === CHAR_TYPE.EMOJI) return true

  // 可以根据需要添加更多规则
  return false
}
/**
 *
 * @param line
 * @param result
 */
export const customSpacing = (line: string) => {
  let result = ''
  let prevType: keyof typeof CHAR_TYPE | null = null

  for (const char of line) {
    const currentType = getCharType(char) as keyof typeof CHAR_TYPE
    if (prevType && needSpace(prevType, currentType))
      result += ' '

    result += char
    prevType = currentType
  }

  return result
}
