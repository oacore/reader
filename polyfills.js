// Support for IE
// https://stackoverflow.com/a/53332776/5594539
if (window.NodeList && !NodeList.prototype.forEach)
  NodeList.prototype.forEach = Array.prototype.forEach
