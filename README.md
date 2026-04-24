# TRMSAccess

TRMSAccess is a Node.js + Express + MongoDB application layer for the Temporal Relic Management System. It includes:

- Server-side rendered EJS pages
- Matching JSON API endpoints under `/api/*`
- A layered architecture with routes, controllers, services, and repositories
- Docker-based MongoDB seeding
- Local seeding from bundled sample data

## Requirements

- Docker Desktop

or

- Node.js 20+
- Running MongoDB instance

## Project layout

- Application code: [src](./src/server.js)
- Docker setup: [docker-compose.yml](./docker-compose.yml)
- Sample seed data: [sample-data](./TRMSAccess/sample-data)

## Run the Project

The project can either be run with Docker, which will use its own MongoDB instance, or manually to point to a MongoDB instance that may already be running on your local machine.

### Run with Docker

This is the simplest end-to-end path.

```bash
docker compose up --build
```

What happens:

- MongoDB starts in the `mongo` service
- The app starts in the `app` service
- Mongo automatically imports the JSON files from [sample-data](./TRMSAccess/sample-data/) on first startup

URLs:

- App: [http://localhost:3000](http://localhost:3000)
- MongoDB from host: `mongodb://localhost:27017`

### Run Locally

Use this option if you want to run locally against a MongoDB instance already running on your local machine. Using this option **requires** your own mongodb instance.

#### Setup Environment

Duplicate the `.env.example` file in the project root to `.env`. It should look something like:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=trms
PORT=3000
```

Note:
- When running the server in Docker, this `.env` file is ignored, as the Docker container specifies its own environtment variables.

#### Install dependencies

Run the following to install the required dependencies:

```bash
npm install
```

#### Run the Server

Ensure that MongoDB is running locally, and that the address is correct in your `.env` file. Run

```bash
npm run seed:local
```

to seed the local MongoDB database with the seed data in [sample-data](./TRMSAccess/sample-data/). Then run

```bash
npm start
```
to start the server.

## Seed data

Bundled seed files live in [sample-data](./TRMSAccess/sample-data/):

- `TRMS.Personnel.json`
- `TRMS.Mission.json`
- `TRMS.ContainmentUnit.json`
- `TRMS.Relic.json`
- `TRMS.AccessLog.json`

### Docker seeding

Docker uses [docker/mongo-init.js](./TRMSAccess/docker/mongo-init.js:1) to import sample data automatically when the Mongo volume is empty.

### Local seed

Run:

```bash
npm run seed:local
```

This script:

- Connects using `MONGO_URI`
- Reads the JSON files from [sample-data](./TRMSAccess/sample-data/)
- Strips any UTF-8 BOM before parsing
- Inserts data only if the target collection is currently empty

## Run the local seed script inside Docker

Because the sample data now lives inside the repo and is copied into the image, you can also run:

```bash
docker compose exec app npm run seed:local
```

Use that only if the app container is already running.

## Useful commands

Syntax check:

```bash
npm run check
```

Start in development mode:

```bash
npm run dev
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove Mongo data volume:

```bash
docker compose down -v
```

Use `down -v` if you want Docker seeding to run again from a clean database.

## Common issues

### `getaddrinfo ENOTFOUND mongo`

You are running the app or seed script on your host machine while `MONGO_URI` still points to `mongodb://mongo:27017`.

Fix:

- For host runs, use `MONGO_URI=mongodb://localhost:27017`
- For container runs, Docker Compose sets `MONGO_URI=mongodb://mongo:27017` automatically

### `Unexpected token '﻿'` or `"[" is not valid JSON`

One or more seed files contain a UTF-8 BOM. The local seed script already strips that BOM before parsing, so make sure you are using the current version of [scripts/seed-local.js](./TRMSAccess/scripts/seed-local.js).
