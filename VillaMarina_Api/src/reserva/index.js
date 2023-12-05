"use strict";
const { Router } = require("express");
const router = Router();
const { con } = require("../env");
const sql = "SELECT Date FROM Reserva";

router.get("/", (req, res) => {
  con.query(sql, (err, result) => (err ? res.send({ msg: "error" }) : res.send(result)));
});

router.get("/Now", (req, res) => res.send(new Date()));

module.exports = router;
