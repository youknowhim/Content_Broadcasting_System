const db = require("../config/db");
const { hash, compare } = require("../services/auth.service");
const { sign } = require("../utils/jwt");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const [exist] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
  if (exist.length) return res.status(400).json({ msg: "Email exists" });

  const hashed = await hash(password);

  await db.execute(
    "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)",
    [name, email, hashed, role || "teacher"]
  );

  res.json({ msg: "Registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
  if (!rows.length) return res.status(400).json({ msg: "Invalid" });

  const user = rows[0];
  const valid = await compare(password, user.password_hash);

  if (!valid) return res.status(400).json({ msg: "Invalid" });

  const token = sign(user);

  res.json({ token });
};