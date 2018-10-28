import { getMultihash } from './multihash'

export const formatGroupInfo = res =>
   res[0].map((id, i) => ({id, fee:res[1][i], limit:res[2][i], owner:res[3][i] }))

export const formatGroupData = res =>
  res[0].map((id, i) => getMultihash([res[1][i], res[2][i], res[3][i]]))

export const formatNotes = res =>
  res[0].map((id, i) => getMultihash([res[0][i], res[1][i], res[2][i]]))

export const combineGroupDataAndInfo = (info, data) => info.map((gi, i) => {
  gi.hash = data[i];
  return gi;
})
