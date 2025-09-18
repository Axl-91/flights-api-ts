import { PrismaClient } from '../generated/prisma/client'
import flightData from './flights.json'
import passengerData from './passengers.json'
import purchaseData from './purchase.json'
import seatsData from './seats.json'
import boardingPassesData from './boardingPasses.json'

const prisma = new PrismaClient();

async function seedAirplanes() {
  await prisma.airplane.createMany({
    data: [
      { airplane_id: 1, name: 'AirNova-660' },
      { airplane_id: 2, name: 'AirMax-720neo' },
    ]
  });

  console.log('Seeded airplanes successfully');
}

async function seedFlights() {
  await prisma.flight.createMany({
    data: flightData,
    skipDuplicates: true
  });

  console.log('Seeded flights successfully');
}

async function seedPassengers() {
  await prisma.passenger.createMany(
    {
      data: passengerData,
      skipDuplicates: true
    }
  )

  console.log('Seeded passengers successfully');
}

async function seedPurchases() {
  await prisma.purchase.createMany(
    {
      data: purchaseData,
      skipDuplicates: true
    }
  )

  console.log('Seeded purchases successfully');
}

async function seedSeatTypes() {
  await prisma.seatType.createMany(
    {
      data: [
        { seat_type_id: 1, name: 'Primera clase' },
        { seat_type_id: 2, name: 'Clase económica premium' },
        { seat_type_id: 3, name: 'Clase económica' }
      ]
    });

  console.log('Seeded seat types successfully');
}

async function seedSeats() {
  await prisma.seat.createMany(
    {
      data: seatsData,
      skipDuplicates: true
    }
  )

  console.log('Seeded seats successfully');
}


async function seedBoardingPasses() {
  await prisma.boardingPass.createMany(
    {
      data: boardingPassesData,
      skipDuplicates: true
    }
  )

  console.log('Seeded seats successfully');
}

async function seed() {
  await seedAirplanes();
  await seedFlights();
  await seedPassengers();
  await seedPurchases();
  await seedSeatTypes();
  await seedSeats();
  await seedBoardingPasses();
}


seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

