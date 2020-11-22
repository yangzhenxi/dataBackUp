import moment from 'moment'
import 'moment/locale/zh-cn'
import dict from './dict'
moment.locale('zh-cn')

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = s => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * unix 时间戳转换
 * @param { Number } unix 时间戳
 * @param { String } pattern 格式
 */
export function unixToDate (unix, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment.unix(unix).format(pattern)
}
/**
 * 字典转换
 * @param { any } val 值
 * @param { String } filter 过滤器
 */
export function toDict (val, filter) {
  if (!val && val !== false && val !== 0) {
    return '-'
  }
  if (!filter) {
    return val
  } else {
    return val
  }
}

/**
 * 过滤器
 * @param { any } val 值
 * @param { String } filter 过滤器
 * @param { String } args 过滤器参数
 */
export function convert (val, filter, args) {
  if (!val && val !== false && val !== 0) {
    return '-'
  }
  if (!filter) {
    return val
  }
  if (dict[filter]) {
    return deepGet(dict[filter].find(e => e.key === val), 'val')
  } else {
    switch (filter) {
 
      case 'unix':
        if (val === '0') {
          return '暂无数据'
        }
        return unixToDate(val, args)
     
    }
  }
}

/**
 * 对象查找
 * @param { String } object 对象
 * @param { String | Array } path 路径
 * @param { String } defaultValue 默认值
 */
export function deepGet (object, path, defaultValue) {
  const s = (!Array.isArray(path)
    ? path
        .replace(/\[/g, '.')
        .replace(/\]/g, '')
        .split('.')
    : path
  ).reduce((o, k) => (o || {})[k], object)
  return s !== false && isEmpty(s) ? defaultValue : s
}

/**
 * 数组去重
 * @param { Array } Array 数组
 */
export function uniq (array) {
  return [...new Set(array)]
}

/**
 * 是否为空
 * @param { Object } o 对象
 */
export function isEmpty (o) {
  const type = Object.prototype.toString.call(o)
  switch (type) {
    case '[object Boolean]':
      return !o
    case '[object Number]':
      return false
    case '[object String]':
      return o === ''
    case '[object Undefined]':
      return true
    case '[object Null]':
      return true
    case '[object Array]':
      return o.length === 0
    case '[object Object]':
      return Object.keys(o).length === 0
    case '[object Function]':
      return false
    case '[object Symbol]':
      return false
  }
}
export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

export function getRowSpanCount (data, index) {
    // debugger
    let preValue = data[0] // 数组第一个
    const res = [[preValue]]
    let i = 0
    for (let j = 1; j < data.length; j++) {
      if (data[j] === preValue) {
        res[i].push(data[j])
      } else {
        i += 1
        res[i] = []
        res[i].push(data[j])
        preValue = data[j]
      }
    }
    const result = []
    res.map((u) => {
      u.map((_, p) => {
        result.push(p === 0 ? u.length : 0)
      })
    })
    return result[index]
  }
