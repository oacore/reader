import { debounce as _debounce } from 'lodash'

const debounce = debounceTime => {
  return (_, __, descriptor) => {
    if (debounceTime !== 0)
      descriptor.value = _debounce(descriptor.value, debounceTime)
    return descriptor
  }
}

export default debounce
