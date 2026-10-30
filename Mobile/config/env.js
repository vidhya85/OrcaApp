const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const environment =
    (process.env.ENV || "PROD").toUpperCase();

const environments = {

    UAT: {
        host: process.env.UAT_DB_HOST,
        port: Number(process.env.UAT_DB_PORT),
        database: process.env.UAT_DB_NAME,
        user: process.env.UAT_DB_USER,
        password: process.env.UAT_DB_PASSWORD
    },

    PROD: {
        host: process.env.PROD_DB_HOST,
        port: Number(process.env.PROD_DB_PORT),
        database: process.env.PROD_DB_NAME,
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD
    }
};

if (!environments[environment]) {
    throw new Error(
        `Invalid ENV: ${environment}. Use UAT or PROD.`
    );
}

module.exports = {
    environment,
    db: environments[environment]
};