const connection = require("../knexfile");
const knex = require("knex")(connection);

const LOCATIONS_TABLE = "locations";

const SRID = 4326;

const st = {
	geomFromText: (data, srid) => `ST_GeomFromText('${data}', ${srid})`,
	pointFromLngLat: (longitude, latitude) => `POINT(${longitude} ${latitude})`,
	distance: (x, y, alias = null) =>
		`ST_Distance(${x}, ${y})${alias ? " as " + alias : ""}`,
};

const createLocation = (data) => {
	return knex(LOCATIONS_TABLE)
		.insert({
			...data,
			geolocation: knex.raw(
				st.geomFromText(st.pointFromLngLat(data.longitude, data.latitude), SRID)
			),
		})
		.returning("*");
};

const findNearbyLocations = (coords, range) => {
	return knex(LOCATIONS_TABLE)
		.select(
			"name",
			knex.raw(
				st.distance(
					`${LOCATIONS_TABLE}.geolocation`,
					st.geomFromText(
						st.pointFromLngLat(coords.longitude, coords.latitude),
						SRID
					),
					"distance"
				)
			)
		)
		.whereRaw(
			`${st.distance(
				`${LOCATIONS_TABLE}.geolocation`,
				st.geomFromText(
					st.pointFromLngLat(coords.longitude, coords.latitude),
					SRID
				)
			)} < ${range}`
		);
};

const findNearbyLocationsToLocation = (id, range) => {
	return knex
		.queryBuilder()
		.select(
			"name",
			knex.raw(
				st.distance(
					`${LOCATIONS_TABLE}.geolocation`,
					"loc.geolocation",
					"distance"
				)
			)
		)
		.from(
			knex.raw(`
        ${LOCATIONS_TABLE},
        lateral(
          SELECT id, geolocation FROM ${LOCATIONS_TABLE} WHERE id = ${id}
        ) as loc
      `)
		)
		.whereRaw(
			`${LOCATIONS_TABLE}.id <> loc.id AND ${st.distance(
				`${LOCATIONS_TABLE}.geolocation`,
				"loc.geolocation"
			)} < ${range}`
		);
};

createLocation({
	name: "Talar del lago",
	longitude: -58.65798,
	latitude: -34.439757,
}).then(([location]) => {
	console.log(location);
});

createLocation({
	name: "San Carlos",
	longitude: -58.68109,
	latitude: -34.47827,
}).then(([location]) => {
	console.log(location);
});

findNearbyLocationsToLocation(1, 5000).then((locations) => {
	console.log(locations);
});

findNearbyLocations(
	{
		longitude: -58.65798,
		latitude: -34.439757,
	},
	4000
).then((locations) => {
	console.log(locations);
});
