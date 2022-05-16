import express from "express";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";

import { sendRawMail } from "./handlers/emails.js";
// Set up the express app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// get all todos
app.get("/api/v1/todos", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "todos retrieved successfully",
    todos: [],
  });
});
const PORT = 6666;

app.post("/api/v1/sendRawMail", async (req, res) => {
  const { email, subject, body } = req.body;
  await sendRawMail({ email, subject, body });

  res.status(200).send({
    success: "true",
  });
});

console.log(https.createServer, "LLLLLLLLLLLLLLLL");

https
  .createServer(
    { key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") },
    app
  )
  .listen(PORT, function () {
    console.log(
      "Your server is listening on port %d (https://localhost:%d)",
      PORT,
      PORT
    );
  });

// app.listen(PORT, () => {
//   console.log(`server running on port ${PORT}`);
// });
