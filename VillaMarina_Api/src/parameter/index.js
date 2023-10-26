"use strict";
const { Router } = require("express");
const router = Router();
const { con } = require("../env");
const Token = `SELECT * FROM Token WHERE id = 0`;

router.get("/Get", async (req, res) => {
  //const DROP = "DROP TABLE Configuration";
  //const CREATE = "CREATE TABLE Configuration (id INT, Price INT, minDay INT)";
  //const INSERT = "INSERT INTO Configuration VALUES (1, 100, 7)";
  //const UPDATE = "UPDATE Configuration VALUES (1, 100, 7) WHERE id = 1";
  const SELECT = "SELECT * FROM Configuration WHERE id = 1";
  //con.query(DROP, () => null);
  //con.query(CREATE, () => null);
  //con.query(INSERT, () => null);
  //con.query(UPDATE, () => null);
  con.query(SELECT, (err, result) => res.send(result[0]));
});

router.post("/Set", async (req, res) => {
  if (req.headers.authorization) {
    con.query(Token, (err, result) => {
      if (req.headers.authorization === result[0].Token) {
        const UPDATE = `UPDATE Configuration SET Price = ${req.body.Price}, minDay = ${req.body.minDay} WHERE id = 1`;
        con.query(UPDATE, () => res.send({ msg: "Correcto!" }));
      } else {
        res.send({ msg: "Error en el Token, volver a iniciar sessión." });
      }
    });
  } else {
    res.send({ msg: "Token no disponible, volver a iniciar sessión." });
  }
});

module.exports = router;
