const TABLE_NAME = "locations";

exports.up = async (knex) => {
	return knex.schema.createTable(TABLE_NAME, function (table) {
		table.increments("id");
		table.string("name", 255).notNullable();
		table.specificType("latitude", "double precision").notNull();
		table.specificType("longitude", "double precision").notNull();
	});
};

exports.down = async (knex) => {
	return knex.schema.dropTable(TABLE_NAME);
};
