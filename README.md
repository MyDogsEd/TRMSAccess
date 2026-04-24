# TRMSAccess

TRMSAccess is a Node.js + Express + MongoDB application layer for the Temporal Relic Management System. It includes:

- Server-side rendered EJS pages
- Matching JSON API endpoints under `/api/*`
- A layered architecture with routes, controllers, services, and repositories
- Docker-based MongoDB seeding
- Local seeding from bundled sample data

## Requirements

- Node.js 20+
- npm
- Docker Desktop (for the containerized workflow)

## Project layout

- Application code: [src](/C:/Users/radja/Desktop/project/TRMSAccess/src:1)
- Docker setup: [docker-compose.yml](/C:/Users/radja/Desktop/project/TRMSAccess/docker-compose.yml:1), [docker/mongo-init.js](/C:/Users/radja/Desktop/project/TRMSAccess/docker/mongo-init.js:1)
- Sample seed data: [sample-data](/C:/Users/radja/Desktop/project/TRMSAccess/sample-data:1)

## Environment

Create a `.env` file in the project root. For local host-based runs, use:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=trms
PORT=3000
```

Notes:

- `localhost` is correct when you run Node on your host machine.
- Docker Compose overrides the app container environment to use `mongodb://mongo:27017`.

## Install dependencies

```bash
npm install
```

## Run with Docker

This is the simplest end-to-end path.

```bash
docker compose up --build
```

What happens:

- MongoDB starts in the `mongo` service
- The app starts in the `app` service
- Mongo automatically imports the JSON files from [sample-data](/C:/Users/radja/Desktop/project/TRMSAccess/sample-data:1) on first startup

URLs:

- App: [http://localhost:3000](http://localhost:3000)
- MongoDB from host: `mongodb://localhost:27017`

## Run locally against MongoDB on your machine

1. Start MongoDB so it is reachable at `localhost:27017`
2. Make sure your `.env` uses `MONGO_URI=mongodb://localhost:27017`
3. Install dependencies
4. Seed the database if needed
5. Start the app

Commands:

```bash
npm run seed:local
npm start
```

## Seed data

Bundled seed files live in [sample-data](/C:/Users/radja/Desktop/project/TRMSAccess/sample-data:1):

- `TRMS.Personnel.json`
- `TRMS.Mission.json`
- `TRMS.ContainmentUnit.json`
- `TRMS.Relic.json`
- `TRMS.AccessLog.json`

### Docker seed

Docker uses [docker/mongo-init.js](/C:/Users/radja/Desktop/project/TRMSAccess/docker/mongo-init.js:1) to import sample data automatically when the Mongo volume is empty.

### Local seed

Run:

```bash
npm run seed:local
```

This script:

- Connects using `MONGO_URI`
- Reads the JSON files from [sample-data](/C:/Users/radja/Desktop/project/TRMSAccess/sample-data:1)
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

One or more seed files contain a UTF-8 BOM. The local seed script already strips that BOM before parsing, so make sure you are using the current version of [scripts/seed-local.js](/C:/Users/radja/Desktop/project/TRMSAccess/scripts/seed-local.js:1).
