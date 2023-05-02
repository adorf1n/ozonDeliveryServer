require("dotenv").config();
var express = require("express");
var app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
var sql = require("mssql");

app.use(cors());

var config = {
  user: process.env.MSSQL_USER_LOGIN,
  password: process.env.MSSQL_USER_PASSWORD,
  server: process.env.MSSQL_SERVER_API,
  database: process.env.MSSQL_DATABASE_NAME,
  trustServerCertificate: true,
};

app.use(express.static("public"));
app.use(bodyParser.json());

//ТЕСТИРОВАНИЕ
app.get("/api/townlist", async (req, res) => {
  const pool = await sql.connect(config);
  let connection = new sql.ConnectionPool(config, function (err) {
    let request = new sql.Request(connection);
    try {
      pool
        .request()

        .query(`Select * FROM ozonTownList`)
        .then((result) => {
          res.status(200).json({ townlist: result.recordset });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ success: false, message: "Error on server" });
        })
        .finally(() => {
          connection.close();
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error on server" });
    }
  });
});

//ПОИСК ГОРОДА

app.get("/api/pricelist/:id", async (req, res) => {
  const TownID = req.params.id;
  const pool = await sql.connect(config);
  let connection = await new sql.ConnectionPool(config, async function (err) {
    let request = await new sql.Request(connection);
    try {
      pool
        .request()
        .input("TownID", sql.Int, TownID)
        .query(`Select * FROM ozonPriceList where TownID = @TownID`)
        .then((result) => {
          res.status(200).json({ pricelist: result.recordset });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ success: false, message: "Error on server" });
        })
        .finally(() => {
          connection.close();
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error on server" });
    }
  });
});

var server = app.listen(8080, function () {
  console.log("Server is running..");
});
