# geospatial-knex-example

For you to run this example code you need to have PostgreSQL and PostGIS.
There are some function for creating locations and querying them.

## Steps

Run the migrations with the following command

```bash
$ npx knex migrate:latest
```

Create a `.env` file in the root directory following the example file (`.env.example`)

Start in dev mode with

```bash
$ npm run dev
```
