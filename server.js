const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "icestock_secret";

// TEMP STORAGE (later we use database)
let users = [];

// HOME
app.get("/", (req, res) => {
  res.send("Icestock Sport Server Running ✅");
});

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role
  };

  users.push(user);

  res.send("User Registered ✅");
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.send("User not found ❌");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Wrong password ❌");

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);

  res.json({ message: "Login Success ✅", token });
});

// START
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
app.get("/test-register", (req, res) => {
  res.json({
    message: "Register API working ✅"
  });
});
