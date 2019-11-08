// Support for IE
// https://stackoverflow.com/a/53332776/5594539
import smoothscroll from 'smoothscroll-polyfill'

if (window.NodeList && !NodeList.prototype.forEach)
  NodeList.prototype.forEach = Array.prototype.forEach

smoothscroll.polyfill()
