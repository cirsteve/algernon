
export const formatGroupInfo = res =>
  res.ids.map((id, i) => ({id, fee:res.fees[i], limit:res.limits[i], owner:res.owners[i] }))

export const formatGroupData = res =>
  res.ids.map((id, i) => [res.hashes[i], res.functions[i], res.sizes[i]])
