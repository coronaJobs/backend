let LOGGING;

if (process.env.DB_LOGGING === '1') {
  LOGGING = console.log;
} else {
  LOGGING = false;
}

const config = {
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  dialect: process.env.DB_DIALECT || 'postgres',
  database: process.env.RDS_DB_NAME,
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  logging: LOGGING,
};

module.exports = config;