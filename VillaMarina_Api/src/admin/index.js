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

module.exports = router;
