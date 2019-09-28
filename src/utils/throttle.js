import { throttle as _throttle } from 'lodash'

const throttle = throttleTime => {
  return (_, __, descriptor) => {
    if (throttleTime !== 0)
      descriptor.value = _throttle(descriptor.value, throttleTime)
    return descriptor
  }
}

export default throttle
