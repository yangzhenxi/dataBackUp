const mergeCellKey = (text, array, columns) => {
    const temp = {} // 当前重复的值,支持多列
  let i = 0
  if (text !== temp[columns]) {
    temp[columns] = text
    console.log(array)
    array.forEach((item) => {
      if (item[columns] === temp[columns]) {
        i += 1
      }
    })
  }
  return i
}
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {}
  }
  return obj
}
export { mergeCellKey, renderContent }
