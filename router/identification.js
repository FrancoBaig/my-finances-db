const registerRouter = require("express").Router();
const pool = require("../mysql_connector");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

registerRouter.post("/signup", async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || typeof name !== "string") {
		return res.json({ status: "error", error: "Invalid username" });
	}

	if (!password || typeof password !== "string") {
		return res.json({ status: "error", error: "Invalid password" });
	}

	if (password.length < 5) {
		return res.json({
			status: "error",
			error: "Password should be at least 6 characters",
		});
	}

	if (!email || typeof email !== "string") {
		return res.json({ status: "error", error: "Invalid email" });
	}

	let result = await pool.query(
		"SELECT * FROM `user` WHERE `user`.`email` = ?",
		[email]
	);

	if (result[0].length !== 0) {
		return res.json({
			status: "error",
			error: "Email is already taken",
		});
	}

	const passwordHash = await bcrypt.hash(password, 10);

	try {
		await pool.query(
			"INSERT INTO `user` (`user_id`, `email`, `name`, `password`) VALUES (NULL, ?, ?, ?)",
			[email, name, passwordHash]
		);
		res.json({ status: "ok" });
	} catch (error) {
		throw error;
	}
});

registerRouter.post("/login", async (req, res) => {
	const { email, password } = req.body;

	let [rows, fields] = await await pool.query(
		"SELECT * FROM `user` WHERE `user`.`email` = ?",
		[email]
	);

	const user = rows[0];

	if (user == undefined) {
		return res.json({
			status: "error",
			error: "Invalid email or password",
		});
	}

	const result = await bcrypt.compare(password, user.password);

	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(
			{ id: user.userId, email: user.email, name: user.name },
			process.env.JWT_SECRET,
			{ noTimestamp: true, expiresIn: "24h" }
		);

		const data = {
			name: user.name,
			email: user.email,
			token: token,
		};

		return res.json({ status: "ok", data: data });
	}

	return res.json({ status: "error", error: "Invalid email or password" });
});

module.exports = registerRouter;
