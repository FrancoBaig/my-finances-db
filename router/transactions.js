const transactionsRouter = require("express").Router();
const pool = require("../mysql_connector");
const jwt = require("jsonwebtoken");

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
