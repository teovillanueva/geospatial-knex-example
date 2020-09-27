require("dotenv").config();

module.exports = {
	client: "postgresql",
	connection: {
		database: process.env.PG_DATABASE,
		user: process.env.PG_USERNAME,
		password: process.env.PG_PASSWORD,
	},
	migrations: {
		tableName: "knex_migrations",
		directory: "./src/database/migrations",
	},
};
