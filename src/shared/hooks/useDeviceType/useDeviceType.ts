const mobileRegex = /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/
const tabletRegex = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i

export function useDeviceType(type = 'mobile') {
  const device = window.navigator.userAgent
  if (mobileRegex.test(device) || tabletRegex.test(device)) {
    return true
  }

  return false
}
