# Flights API

Challenge made on JS and now migrated to TS with a Postgres DB via Docker Compose and added migrations via Prisma

## Description

API that simulates a check-in for all the passengers of flight.

Given an amount of passangers in a flight and assigned to a plane this API will simulate the best possible seatting of those persons in the plane.

## Setup

Install dependencies

```bash
npm install
```

### Env Vars
Create an `.env` file with the following format

``` dotenv
# Server port
PORT=

#DB data
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>"
```

Complete the values on the `.env` files

### Setup db

```bash
# generate prisma client
npx prisma generate

# apply all migrations
npx prisma migrate dev

# Run seeds
npx prisma db seed
```


## Run server

```bash
# Run on development mode
npm run dev

# Build and run in production
npm build
npm start
```

## Endpoints

### `/flights/:flight_id/passengers` 

This will return the flight data with all the passengers with their seat assigned
