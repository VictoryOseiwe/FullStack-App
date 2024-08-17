import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";

// Loads environment variables from a .env file
env.config();

// Creates an Express application instance
const app = express();
const PORT = process.env.PORT;

// Middlewares for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Creates a new PostgreSQL client instance
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: 5432,
});

// Connects to the PostgreSQL database
db.connect();

//Assigns all the http methods to the same route
app.all(`/`, async (req, res) => {
  try {
    //Checks if the request method is POST
    if (req.method === "POST") {
      const { name, email } = req.body;

      //Checks if the if input is null or empty
      if (!name || !email) {
        res.status(404).json({ error: "Name and Email must be provided" });
      }

      //Adds a new user to the DATABASE TABLE
      await db.query("INSERT INTO form(name, email) VALUES ($1, $2)", [
        name,
        email,
      ]);

      console.log("User added successfully");
    }

    //Checks if the request method is DELETE
    if (req.method === "DELETE") {
      const result = await db.query("DELETE FROM form");
      console.log("All users deleted successfully");
      return res.json(result.rows);
    }

    //If none of the above conditions are met, sends a GET request
    const result = await db.query("SELECT * FROM form");
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Listening for port
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
