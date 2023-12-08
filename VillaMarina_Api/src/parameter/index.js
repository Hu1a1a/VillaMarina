"use strict";
const { Router } = require("express");
const router = Router();
const { con } = require("../env");
const Token = `SELECT * FROM Token WHERE id = 0`;
const Config = "SELECT * FROM Configuration WHERE id = 1";

router.get("/Get", async (req, res) => {
  con.query(Config, (err, result) => (err ? res.send({}) : res.send(result[0])));
});

router.post("/Set", async (req, res) => {
  if (req.headers.authorization && req.body.Price && req.body.minDay) {
    if (typeof req.body.Price === "number" && typeof req.body.minDay === "number") {
      con.query(Token, (err, result) => {
        if (err) res.send({ msg: "Error en el DDBB, contacte con el administrador." });
        else {
          if (req.headers.authorization === result[0].Token) {
            const UPDATE = `UPDATE Configuration SET Price = ${req.body.Price}, minDay = ${req.body.minDay} WHERE id = 1`;
            con.query(UPDATE, (err) =>
              err
                ? res.send({ msg: "Error en el DDBB, contacte con el administrador." })
                : res.send({ msg: "Configuración modificada correctamente!" })
            );
          } else res.send({ msg: "Error en el Token, volver a iniciar sessión." });
        }
      });
    } else res.send({ msg: "Token no disponible, volver a iniciar sessión." });
  } else res.send({ msg: "Token no disponible, volver a iniciar sessión." });
});

module.exports = router;
