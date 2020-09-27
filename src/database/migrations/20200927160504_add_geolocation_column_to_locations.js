const TABLE_NAME = "locations";

exports.up = function (knex) {
	return knex.raw(
		`ALTER TABLE ${TABLE_NAME} ADD COLUMN geolocation geography(point);`
	);
};

exports.down = function (knex) {
	return knex.raw(`ALTER TABLE ${TABLE_NAME} DROP COLUMN geolocation;`);
};
