const categoriesRouter = require("express").Router();
const pool = require("../mysql_connector");
const jwt = require("jsonwebtoken");

categoriesRouter.get("/", async (req, res) => {
	const token = req.get("authorization");

	try {
		let user = jwt.verify(token, process.env.JWT_SECRET);
		const [row, fields] = await pool.query(
			"SELECT * FROM `category` WHERE `category`.`user_id` = ?",
			[user.user_id]
		);

		res.json({ status: "ok", data: row });
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}
});

module.exports = categoriesRouter;
