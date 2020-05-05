const { Suite } = require('benchmark')
const { hashSync, genSaltSync } = require('bcrypt')
const chalk = require('chalk')

const { hash, genSalt } = require('../index')

const hashRounds = [10, 12, 14]

const password = 'node-rust-password'

const saltSuite = new Suite('Salt round')

saltSuite
  .add('@node-rs/bcrypt', () => {
    genSalt()
  })
  .add('node bcrypt', () => {
    genSaltSync()
  })
  .on('cycle', function (event) {
    console.info(String(event.target))
  })
  .on('complete', function () {
    console.info(`${this.name} bench suite: Fastest is ${chalk.green(this.filter('fastest').map('name'))}`)
  })
  .run()

for (const round of hashRounds) {
  const hashSuite = new Suite(`Hash round ${round}`)
  hashSuite
    .add('@node-rs/bcrypt', () => {
      hash(password, round)
    })
    .add('node bcrypt', () => {
      hashSync(password, round)
    })
    .on('cycle', function (event) {
      console.info(String(event.target))
    })
    .on('complete', function () {
      console.info(`${this.name} bench suite: Fastest is ${chalk.green(this.filter('fastest').map('name'))}`)
    })
    .run()
}
