// 给指定元素添加指定的类样式
export function addClass(el, className) {
  if(hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 判断元素是否有类样式
export function hasClass(el, className) {
  var reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
  return reg.test(el.className)
}