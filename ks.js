exports.sum = function (a, b) {
  return a + b
}

exports.string = function () {
  return 'String'
}

exports.getUser = function () {
  return {
    id: 1,
    username: 'test',
    role: 2
  }
}

exports.getRole = function() {
  return {
    id: 1,
    name: 'admin'
  }
}