const transactionsRouter = require("express").Router();
const pool = require("../mysql_connector");
const jwt = require("jsonwebtoken");

transactionsRouter.get("/", async (req, res) => {
	const token = req.get("authorization");
	const limit = req.query.limit ? parseInt(req.query.limit) : null;

	try {
		let user = jwt.verify(token, process.env.JWT_SECRET);
		if (limit) {
			const [row, fields] = await pool.query(
				"SELECT `id`, `description`, `amount`, `date`, `category_id` FROM `transaction` WHERE `user_id` = ? LIMIT ?",
				[user.user_id, limit]
			);
			res.status(200).json(row);
		} else {
			const [row, fields] = await pool.query(
				"SELECT * FROM `transaction` WHERE `user_id` = ?",
				[user.user_id]
			);
			res.status(200).json(row);
		}
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

transactionsRouter.post("/", async (req, res) => {
	const { categoryId, amount, description, date } = req.body;
	const token = req.get("authorization");

	try {
		let user = jwt.verify(token, process.env.JWT_SECRET);

		await pool.query(
			"INSERT INTO `transaction` (`id`, `description`, `amount`, `date`, `category_id`, `user_id`) VALUES (NULL, ?, ?, ?, ?, ?);",
			[description, amount, date, categoryId, user.user_id]
		);

		res.json({ status: "ok" });
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

module.exports = transactionsRouter;
