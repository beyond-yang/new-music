import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 30

function insertArray(arr, val, compare, maxlen) {
  let index = arr.findIndex(compare)
  if(index === 0) {
    return 
  }
  if(index>0) {
    arr.splice(index, 1)
  } 
  arr.unshift(val)
  if(arr.length> maxlen) {
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

export function savePlay(song) {
  let playHistory = storage.get(PLAY_KEY, [])
  insertArray(playHistory, song, (item)=>{
    return item.id === song.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, playHistory)
  return playHistory
}

export function getPlay() {
  return storage.get(PLAY_KEY, [])
}

