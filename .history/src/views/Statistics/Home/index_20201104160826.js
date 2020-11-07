let i = 0
if (text !== temp[columns]) {
  temp[columns] = text
  array.forEach((item) => {
    if (item[columns] === temp[columns]) {
      i += 1
    }
  })
}
return i
