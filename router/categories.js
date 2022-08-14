const categoriesRouter = require("express").Router();
const pool = require("../mysql_connector");
const jwt = require("jsonwebtoken");

categoriesRouter.get("/:year/:month", async (req, res) => {
	const token = req.get("authorization");
	const year = req.params.year;
	const month = req.params.month;

	try {
		let user = jwt.verify(token, process.env.JWT_SECRET);
		let category_type = 1;

		// Get incomes
		const [incomes, fields] = await pool.query(
			"SELECT c.id, c.title, SUM(CASE WHEN YEAR(t.date) = 2022 AND MONTH(t.date) = 08 THEN t.amount ELSE 0 END) AS balance FROM category c LEFT JOIN transaction t ON t.category_id = c.id WHERE c.user_id = 12 AND c.category_type_id = 1 GROUP BY c.id",
			[year, month, user.user_id, category_type]
		);

		// Get expenses
		category_type = 2;
		const [expenses, field] = await pool.query(
			"SELECT c.id, c.title, SUM(CASE WHEN YEAR(t.date) = 2022 AND MONTH(t.date) = 08 THEN t.amount ELSE 0 END) AS balance FROM category c LEFT JOIN transaction t ON t.category_id = c.id WHERE c.user_id = 12 AND c.category_type_id = 2 GROUP BY c.id",
			[year, month, user.user_id, category_type]
		);

		const result = {
			incomes: [...incomes],
			expenses: [...expenses],
		};

		res.json({ status: "ok", data: result });
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

categoriesRouter.post("/", async (req, res) => {
	const body = req.body;
	const token = req.get("authorization");

	try {
		let user = jwt.verify(token, process.env.JWT_SECRET);
		const [row, fields] = await pool.query(
			"INSERT INTO `category` (`id`, `title`, `user_id`, `category_type_id`) VALUES (NULL, ?, ?, ?); ",
			[body.title, user.user_id, body.category_type]
		);

		res.json({ status: "ok", id: row.insertId });
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

module.exports = categoriesRouter;
