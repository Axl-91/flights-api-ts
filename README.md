# Flights API

Challenge made on JS, now migrated to TS with a Postgres DB via Docker Compose and added migrations via Prisma

## Summary
API that simulates check-in for all passengers of a flight.

Given a flight with a set of passengers assigned to an airplane, this API will simulate the best possible seating arrangement.

## Database Schema
The database contains the following tables:
- Airplane
- Flight
- Passenger
- Purchase
- Seat
- SeatType
- BoardingPass

## Objective
The main objective of the API is to simulate a check-in.  

Given a `flight_id`, the system must collect the passengers of that flight and assign the most suitable seat for each of them, following these rules:

- Passengers belonging to the same purchase (`purchase_id`) should be seated together.  
- If there is a minor in the group, they must be seated in an adjacent row to an adult from their same group.  
- Some passengers may already have an assigned seat, which must be respected.

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

This endpoint will return the flight data with all the passengers with their seat assigned

### `/flights/:flight_id/seats`

This endpoint will return all seats from a flight

## Frontend integration

Alongside with this server there is a frontend [flights-frontend](https://github.com/Axl-91/flights-frontend) [WIP]
