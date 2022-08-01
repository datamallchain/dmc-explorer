const BigNumber = require('bignumber.js')

function char_to_symbol(c) {
  if (c >= 97 && c <= 122) return (c - 97) + 6
  if (c >= 49 && c <= 53) return (c - 49) + 1
  return 0
}

function stringToName(str) {
  const len = str.length

  let value = new BigNumber(0)

  for (let i = 0; i <= 12; ++i) {
    let c = 0
    if (i < len && i <= 12) {
      c = char_to_symbol(str.charCodeAt(i))
    }

    if (i < 12) {
      c &= 0x1f
      let b_c = new BigNumber(c)
      const two = new BigNumber(2)
      b_c = b_c.times(two.pow(64 - 5 * (i + 1)))
      value = value.plus(b_c)
    } else {
      c &= 0x0f
      value = value.plus(c)
    }
  }

  return value.toFixed()
}

export default stringToName
