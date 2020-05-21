let LOGGING;

if (process.env.DB_LOGGING === "1") {
  LOGGING = console.log;
} else {
  LOGGING = false;
}

const config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT || "postgres",
  database: process.env.DB_NAME,
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  logging: LOGGING,
};

module.exports = config;
