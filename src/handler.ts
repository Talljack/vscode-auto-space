import pangu from 'pangu'
/**
 *
 * @param line
 * @param result
 */
export const customSpacing = (line: string) => {
  // 首先应用 pangu.js 的空格处理
  let result = pangu.spacing(line)

  // 特殊规则 1：移除函数名和左括号之间的空格
  result = result.replace(/([A-Za-z][A-Za-z0-9]*)\s+(\(|\)|\{|\[|\]|:|;|<|>)/g, '$1$2')

  // 特殊规则 2：确保 throw new 和异常类名之间只有一个空格
  result = result.replace(/(throw\s+new)\s+([A-Z][A-Za-z0-9]*)/g, '$1 $2')

  return result
}
