const express = require("express");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");

// routes
const registerRouter = require("./router/identification");

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.listen(process.env.PORT || 3001, () => {
	console.log("Listening port", process.env.PORT || 3001);
});

// routes
app.use("/api/identification/", registerRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
