const { app } = require('./src/server')
const { db } = require('./src/models')


const PORT = process.env.PORT;

// set database
db.sequelize
  .authenticate()
  .then(() => {
    console.log(
      'Connection to the database has been established successfully.'
    );
    
    app.listen({port: PORT}).then(({ url, subscriptionsUrl }) => {
      console.log(`🚀 Server ready at ${url}`);
      console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
    });
  })
  .catch(err => console.error('Unable to connect to the database:', err));
