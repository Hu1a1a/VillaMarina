"use strict";
const { Router } = require("express");
const router = Router();
const { con, ADMIN, PASSWORD } = require("../env");
router.post("/PostToken", async (req, res) => {
  if (req.body.login === ADMIN && req.body.password === PASSWORD) {
    require("crypto").randomBytes(48, (err, buffer) => {
      const token = buffer.toString("hex");
      //const DROP = "DROP TABLE Token";
      //const CREATE = "CREATE TABLE Token (id INT, Token VARCHAR(255))";
      //const DELETE = `DELETE FROM Token`;
      //const INSERT = `INSERT INTO Token (id, Token) VALUES (0, "${token}")`;
      const UPDATE = `UPDATE Token SET Token = "${token}" WHERE id = 0`;
      const SELECT = `SELECT * FROM Token`;
      //con.query(DROP);
      //con.query(CREATE);
      //con.query(DELETE);
      //con.query(INSERT);
      con.query(UPDATE);
      con.query(SELECT, (err, result) => res.send(result[0]));
    });
  } else {
    res.send("Contraseña erronea!");
  }
});

const Token = `SELECT * FROM Token WHERE id = 0`;
const sqlPaying = "SELECT * FROM Paying";
const sqlReserva = "SELECT * FROM Reserva";

router.get("/Data", (req, res) => {
  if (req.headers.authorization) {
    con.query(Token, (err, result) => {
      if (req.headers.authorization === result[0].Token) {
        con.query(sqlPaying, (err, Paying) => con.query(sqlReserva, (err, Reserva) => res.json({ Paying: Paying, Reserva: Reserva })));
      } else {
        res.send({ msg: "Error en el Token, volver a iniciar sessión." });
      }
    });
  } else {
    res.send({ msg: "Token no disponible, volver a iniciar sessión." });
  }
});

router.get("/Reset", (req, res) => {
  if (req.headers.authorization) {
    const Config_Drop = "DROP TABLE Configuration";
    const Config_Create = "CREATE TABLE Configuration (id INT, Price INT, minDay INT)";
    const Config_Insert = "INSERT INTO Configuration VALUES (1, 100, 7)";
    con.query(Config_Drop, (err) => res.send({ msg: err }));
    con.query(Config_Create, (err) => res.send({ msg: err }));
    con.query(Config_Insert, (err) => res.send({ msg: err }));

    const Reserva_Drop = "DROP TABLE Reserva";
    const Reserva_Create =
      "CREATE TABLE Reserva (Date INT, Telf VARCHAR(255), Email VARCHAR(255), Name VARCHAR(255), Striper VARCHAR(255), Importe VARCHAR(255) )";
    con.query(Reserva_Drop, (err) => res.send({ msg: err }));
    con.query(Reserva_Create, (err) => res.send({ msg: err }));

    const Paying_Drop = "DROP TABLE Paying";
    const Paying_Create = "CREATE TABLE Paying (Date INT,ExpireDate INT,ExpireHour INT,ExpireMin INT, Striper VARCHAR(255))";
    con.query(Paying_Drop, (err) => res.send({ msg: err }));
    con.query(Paying_Create, (err) => res.send({ msg: err }));
  } else {
    res.send({ msg: "Token no disponible, volver a iniciar sessión." });
  }
});

module.exports = router;
