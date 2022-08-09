const categoriesRouter = require("express").Router();
const pool = require("../mysql_connector");
const jwt = require("jsonwebtoken");

categoriesRouter.get("/:userId", async (req, res) => {
	const userId = req.params.userId;
	const token = req.get("authorization");

	let user = {};

	try {
		user = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}

	const [result, fields] = await pool.query(
		"SELECT * FROM `user` WHERE `user`.`user_id` = ?",
		[userId]
	);

	if (result[0]?.email !== user.email) {
		return res.json({
			status: "error",
			error: "The user does not exist",
		});
	}

	try {
		const [row, fields] = await pool.query(
			"SELECT * FROM `category` WHERE `category`.`user_id` = ?",
			[userId]
		);
		res.json({ status: "ok", data: row });
	} catch (error) {
		throw error;
	}
});

module.exports = categoriesRouter;
