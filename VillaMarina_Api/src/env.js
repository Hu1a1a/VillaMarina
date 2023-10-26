const mysql = require("mysql");

//mysql for Google Cloud
/*const con = mysql.createConnection({
  host: "34.175.104.109",
  user: "db",
  password: "db",
  database: "Reserva",
});*/

//mysql for localhost
const con = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "password",
  database: "villamarina",
});

//const DOMAIN = "https://hu1a1a.github.io/VillaMarina_Front/#/";
const DOMAIN = "http://localhost:4200/VillaMarina_Front/#/";

const ADMIN = "ADMIN";
const PASSWORD = "ADMIN";

module.exports = {
  con,
  DOMAIN,
  ADMIN,
  PASSWORD,
};
