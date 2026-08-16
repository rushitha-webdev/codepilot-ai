const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "codepilot_user",
    password: "rushitha@1206", 
    database: "codepilot_ai"
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("✅ MySQL Connected");
});

module.exports = connection;