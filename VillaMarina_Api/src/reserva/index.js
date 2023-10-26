"use strict";
const { Router } = require("express");
const router = Router();
const { con } = require("../env");

router.get("/", (req, res) => {
  //const sql = "DROP TABLE Reserva";
  //const sql = "DROP TABLE Paying";
  //const sql = "CREATE TABLE Reserva (Date INT, Telf VARCHAR(255), Email VARCHAR(255), Name VARCHAR(255), Striper VARCHAR(255), Importe VARCHAR(255) )";
  //const sql = "CREATE TABLE Paying (Date INT,ExpireDate INT,ExpireHour INT,ExpireMin INT, Striper VARCHAR(255))";
  const sql = "SELECT Date FROM Reserva";
  con.query(sql, (err, result) => res.send(result));
});

router.get("/Now", (req, res) => res.send(new Date()));

module.exports = router;
