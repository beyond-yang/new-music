export const setPlay = ({commit, state}, {songs, index})=>{
  commit('SET_PLAY_STATE', true),
  commit('SET_FULL_SCREEN', true),
  commit('SET_PLAT_LIST', songs),
  commit('SET_SEQUENCE_LIST', songs),
  commit('SET_CURRENT_INDEX', index)
}