const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.send(`Bienvenido al API de VillaMarina.cat, cualquier uso/manipulación indebido del API será denunciado.`);
});

module.exports = router;
