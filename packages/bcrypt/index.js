const { locateBinding } = require('@node-rs/helper')

const binding = require(locateBinding(__dirname, 'bcrypt'))

module.exports = {
  genSalt: function genSalt(round = 10, version = '2b') {
    return binding.genSalt(round, version)
  },

  hash: function hash(password, round) {
    const input = Buffer.isBuffer(password) ? password : Buffer.from(password)
    return binding.hash(input, round)
  },
}
