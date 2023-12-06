const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const app = express();

app.set("json space", 2);
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

app.use("/Login", require("./admin/index"));
app.use("/Config", require("./parameter/index"));
app.use("/Reserva", require("./reserva/index"));
app.use(
  "/Pago/PaySession",
  rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 500,
    headers: true,
  })
);
app.use("/Pago", require("./stripe/index"));
app.use("/", require("./404/index"));

app.listen(3000);
