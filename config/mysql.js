var mysql = require("mysql");

const connectMysqlDB = async () => {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    // con.query("CREATE DATABASE mydb", function (err, result) {
    //   if (err) throw err;
    //   console.log("Database created");
    // });
  });
};

module.exports = connectMysqlDB;
