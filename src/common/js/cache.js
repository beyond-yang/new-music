import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

function insertArray(arr, val, compare, maxlen) {
  let index = arr.findIndex(compare)
  if(index === 0) {
    return 
  }
  if(index>0) {
    arr.splice(index, 1)
  } 
  arr.unshift(val)
  if(maxlen> 15) {
    arr.pop()
  }
}
function deleteOne(arr, val, compare) {
  let index = arr.findIndex(compare)
  if(index>-1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, function(item) {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function getSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteOneSearch(item) {
  let searches = storage.get(SEARCH_KEY, item)
  deleteOne(searches, item, function(one) {
    return one === item
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.set(SEARCH_KEY, [])
  return storage.get(SEARCH_KEY, [])
}

