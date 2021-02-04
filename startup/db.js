const mongoose=require('mongoose');
const config=require('config');
const DB_URL = process.env.MONGO_URI

/*
module.exports=function(){
    const db=config.get('db');
    mongoose.connect(db,{ useNewUrlParser: true })
    .then(()=> console.log(`connected with mongodb ${db}`));
    mongoose.set('useCreateIndex', true);

}

*/




//const loadModels = require('../app/models')

module.exports = () => {
  const connect = () => {
    mongoose.Promise = global.Promise

    mongoose.connect(
      DB_URL,
      {
        keepAlive: true,
        reconnectTries: Number.MAX_VALUE,
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      err => {
        let dbStatus = ''
        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
        }
        dbStatus = `*    DB Connection: OK\n****************************\n`
        if (process.env.NODE_ENV !== 'test') {
          // Prints initialization
          console.log('****************************')
          console.log('*    Starting Server')
          console.log(`*    Port: ${process.env.PORT || 7000}`)
          console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
          console.log(`*    Database: MongoDB`)
          console.log(dbStatus)
        }
      }
    )
    mongoose.set('useCreateIndex', true)
    mongoose.set('useFindAndModify', false)
  }
  connect()

  mongoose.connection.on('error', console.log)
  mongoose.connection.on('disconnected', connect)

  //load Models if any
}