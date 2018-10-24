import { getMultihash } from './multihash'

export const formatGroupInfo = res =>
  res.ids.map((id, i) => ({id, fee:res.fees[i], limit:res.limits[i], owner:res.owners[i] }))

export const formatGroupData = res =>
  res.ids.map((id, i) => getMultihash([res.hashes[i], res.functions[i], res.sizes[i]]))

export const combineGroupDataAndInfo = (info, data) => info.map((gi, i) => {
  gi.hash = data[i];
  return gi;
})
