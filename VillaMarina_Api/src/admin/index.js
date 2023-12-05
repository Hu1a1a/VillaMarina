"use strict";
const { Router } = require("express");
const router = Router();
const { con, ADMIN, PASSWORD, RESET } = require("../env");
router.post("/PostToken", async (req, res) => {
  if (req.body.login === ADMIN && req.body.password === PASSWORD) {
    require("crypto").randomBytes(48, (err, buffer) => {
      const token = buffer.toString("hex");
      const UPDATE = `UPDATE Token SET Token = "${token}" WHERE id = 0`;
      con.query(UPDATE, (err) => {
        if (err) res.send();
        else {
          const SELECT = `SELECT * FROM Token`;
          con.query(SELECT, (err, result) => (err ? res.send() : res.send(result[0])));
        }
      });
    });
  } else res.send("Contraseña erronea!");
});

const Token = "SELECT * FROM Token WHERE id = 0";
const sqlPaying = "SELECT * FROM Paying";
const sqlReserva = "SELECT * FROM Reserva";

router.get("/Data", (req, res) => {
  if (req.headers.authorization) {
    con.query(Token, (err, result) => {
      if (err) res.send({ msg: "Error en el Token, volver a iniciar sessión." });
      else if (req.headers.authorization === result[0].Token)
        con.query(sqlPaying, (err, Paying) => {
          if (err) res.send({ msg: "Error en el Token, volver a iniciar sessión." });
          else
            con.query(sqlReserva, (err, Reserva) => {
              if (err) res.send({ msg: "Error en el Token, volver a iniciar sessión." });
              else res.json({ Paying: Paying, Reserva: Reserva });
            });
        });
      else res.send({ msg: "Error en el Token, volver a iniciar sessión." });
    });
  } else res.send({ msg: "Token no disponible, volver a iniciar sessión." });
});

router.get("/Reset", (req, res) => {
  if (req.query && req.query.password === RESET) {
    const Config_Drop = "DROP TABLE Configuration";
    const Config_Create = "CREATE TABLE Configuration (id INT, Price INT, minDay INT)";
    const Config_Insert = "INSERT INTO Configuration VALUES (1, 100, 7)";
    con.query(Config_Drop, (err) => null);
    con.query(Config_Create, (err) => null);
    con.query(Config_Insert, (err) => null);

    const Reserva_Drop = "DROP TABLE Reserva";
    const Reserva_Create =
      "CREATE TABLE Reserva (Date INT, Telf VARCHAR(255), Email VARCHAR(255), Name VARCHAR(255), Striper VARCHAR(255), Importe VARCHAR(255) )";
    con.query(Reserva_Drop, (err) => null);
    con.query(Reserva_Create, (err) => null);

    const Paying_Drop = "DROP TABLE Paying";
    const Paying_Create = "CREATE TABLE Paying (Date INT,ExpireDate INT,ExpireHour INT,ExpireMin INT, Striper VARCHAR(255))";
    con.query(Paying_Drop, (err) => null);
    con.query(Paying_Create, (err) => null);

    const Token_Drop = "DROP TABLE Token";
    const Token_Create = "CREATE TABLE Token (id INT, Token VARCHAR(255))";
    const Token_Insert = `INSERT INTO Token (id, Token) VALUES (0, "")`;
    con.query(Token_Drop, (err) => null);
    con.query(Token_Create, (err) => null);
    con.query(Token_Insert, (err) => null);
    res.send("Done!");
  } else res.send();
});

module.exports = router;
