"use strict";
const { Router } = require("express");
const router = Router();
const stripe = require("stripe")("sk_test_51NAfPiCVyyzAcYrFB0YidgYgRGTxxtxnXCmit9lYB1ro2sC95wVq2fwfnfMItl133UHZ8y7lopX0UaCrgQozX2vT00rMXL61Qw");
const { con, DOMAIN } = require("../env");
const sqlReserva = "SELECT Date FROM Reserva";
const sqlPaying = "SELECT * FROM Paying";
const sqlConfig = "SELECT * FROM Configuration WHERE id = 1";
const { Chequeo, GetDay, getDate } = require("./function");

router.post("/PaySession", async (req, res) => {
  con.query(sqlReserva, async (err, iReserva) => {
    if (err) {
      res.send({ msg: "error" });
    } else {
      con.query(sqlPaying, async (err, iPaying) => {
        if (err) {
          res.send({ msg: "error" });
        } else {
          con.query(sqlConfig, async (err, iConfig) => {
            if (err) {
              res.send({ msg: "error" });
            } else {
              const statError = Chequeo(req.body, iReserva, iPaying, iConfig[0]);
              if (statError) {
                return res.json({ Error: statError });
              } else {
                try {
                  const session = await stripe.checkout.sessions.create({
                    line_items: [
                      {
                        price_data: {
                          currency: "eur",
                          unit_amount: iConfig[0].Price * 100,
                          product_data: {
                            name: "Reserva estancia Villa Marina",
                            description: "Reserva de estancia de la fecha " + getDate(req.body.Inicial) + " a " + getDate(req.body.Final),
                            images: [
                              "https://hu1a1a.github.io/VillaMarina/assets/Imagen/Cabecera/Foto1.jpg",
                              "https://hu1a1a.github.io/VillaMarina/assets/Imagen/Cabecera/Foto2.png",
                              "https://hu1a1a.github.io/VillaMarina/assets/Imagen/CASA.png",
                              "https://hu1a1a.github.io/VillaMarina/assets/Imagen/DISPONIBILIDAD.png",
                              "https://hu1a1a.github.io/VillaMarina/assets/Imagen/UBICACION.png",
                            ],
                          },
                        },
                        quantity: req.body.Final - req.body.Inicial + 1,
                      },
                    ],
                    phone_number_collection: {
                      enabled: true,
                    },
                    invoice_creation: {
                      enabled: true,
                    },
                    mode: "payment",
                    success_url: `${DOMAIN}Pago/Success`,
                    cancel_url: `${DOMAIN}Pago/Cancel`,
                    consent_collection: {
                      terms_of_service: "required",
                    },
                    expires_at: Math.floor(new Date().getTime() / 1000 + 32 * 60),
                  });
                  const ExpireDay = new Date(+new Date() + 32 * 60 * 1000);
                  const ExpireDate = GetDay(ExpireDay.getFullYear(), ExpireDay.getMonth(), ExpireDay.getDate());
                  let sqlString = "";
                  for (var i = req.body.Inicial; i <= req.body.Final; i++) {
                    sqlString =
                      sqlString +
                      `,(${i},${ExpireDate},${ExpireDay.getHours()},${ExpireDay.getMinutes()},"${
                        session.url.toString().split("/pay/")[1].split("#")[0]
                      }")`;
                  }
                  if (sqlString) con.query("INSERT INTO Paying VALUES " + sqlString.replace(",", ""), () => null);
                  res.json({ url: session.url });
                } catch {
                  res.send({ msg: "error" });
                }
              }
            }
          });
        }
      });
    }
  });
});

router.get("/Paying", (req, res) => {
  const ExpireDay = new Date(+new Date() + 30 * 60 * 1000);
  const ExpireDate = GetDay(ExpireDay.getFullYear(), ExpireDay.getMonth(), ExpireDay.getDate());
  const DELETE = `DELETE FROM Paying WHERE ExpireDate < "${ExpireDate}"`;
  con.query(DELETE, (err) => {
    if (err) {
      res.send();
    } else {
      con.query(sqlPaying, (err, result) => (err ? res.send() : res.json(result)));
    }
  });
});

router.post("/Check", async (req, res) => {
  if (req.body.Url) {
    const Url = req.body.Url.toString().split("/pay/")[1].split("#")[0];
    try {
      const session = await stripe.checkout.sessions.retrieve(Url);
      if (session.status === "complete") {
        let sqlString = "";
        let date = [];
        con.query(sqlPaying, (err, result) => {
          if (err) {
            res.send();
          } else {
            for (const item of result) {
              if (item.Striper === Url) {
                sqlString =
                  sqlString +
                  `,(${item.Date},"${session.customer_details.phone}","${session.customer_details.email}","${
                    session.customer_details.name
                  }","${Url}","${session.amount_total / 100}")`;
                date.push(item.Date);
              }
            }
            if (sqlString) {
              con.query(`INSERT INTO Reserva VALUES ${sqlString.replace(",", "")}`, () =>
                con.query(`DELETE FROM Paying WHERE Striper = "${Url}"`, () =>
                  con.query(
                    `DELETE FROM Paying WHERE ExpireDate < ${GetDay(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}`,
                    () => null
                  )
                )
              );
            }
            res.json({
              mensaje: "realizado!",
              date: date,
              phone: session.customer_details.phone,
              email: session.customer_details.email,
              name: session.customer_details.name,
              importe: session.amount_total / 100,
              Url: Url,
            });
          }
        });
      } else res.json({ mensaje: "erronea!" });
    } catch {
      res.json({ mensaje: "erronea!" });
    }
  }
});

router.post("/Expire", async (req, res) => {
  if (req.body.Url) {
    if (req.body.Url.toString().split("/pay/").length > 1) {
      const Url = req.body.Url.toString().split("/pay/")[1].split("#")[0];
      try {
        const session = await stripe.checkout.sessions.retrieve(Url);
        if (session.status == "open") {
          await stripe.checkout.sessions.expire(Url);
          con.query(`DELETE FROM Paying WHERE Striper = "${Url}"`, () =>
            con.query(
              `DELETE FROM Paying WHERE ExpireDate < ${GetDay(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}`,
              () => null
            )
          );
        }
      } catch {
        res.json({ mensaje: "erronea!" });
      }
    }
  }
  res.json({ mensaje: "done!" });
});

module.exports = router;
