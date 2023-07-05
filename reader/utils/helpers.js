export const debounce = (callback, time = 250) => {
  let interval
  return (...args) => {
    clearTimeout(interval)
    interval = setTimeout(() => {
      interval = null
      callback(...args)
    }, time)
  }
}

export function checkType(dataProviderId, members) {
  return members.find((item) => {
    if (Array.isArray(item.repo_id))
      return item.repo_id.includes(dataProviderId?.toString())
    return +item.repo_id === +dataProviderId
  })
}

export default { debounce, checkType }
