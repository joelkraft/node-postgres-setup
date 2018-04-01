const db = require('../db')

let query = q =>
  new Promise(resolve =>
    db.query(q, (err, res) => {
      if (err) return console.log(err)
      resolve(console.log('query succeeded'))
    })
  )

const migrations = [
  {
    up: () =>
      query(
        `
          CREATE TABLE transactions (
            ID int,
            Amount float,
            Description varchar(255),
            Category varchar(255),
            Date varchar(30)
          );
          CREATE TABLE categories (
            ID int,
            Name varchar(255),
            Parent varchar(255)
          );
          CREATE TABLE preferences (
            ID int,
            UserID varchar(255),
            Description varchar(255)
          );
        `
      ),
    down: () =>
      query(
        `
            DROP TABLE transactions, categories, preferences;
        `
      )
  }
]

const migrate = (dir, cb) => {
  let p = Promise.resolve()
  migrations
    .reduce((chain, migration) => chain.then(() => migration[dir]()), p)
    .then(cb)
    .catch(e => console.log(e))
}

// If calling from command line
const direction = process.argv[2]
direction && migrate(direction, () => process.exit(0))

module.exports = migrate
