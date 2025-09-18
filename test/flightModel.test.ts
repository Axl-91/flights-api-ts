import { expect, test, vi } from 'vitest'
import prisma from '../src/__mocks__/db'
import { getFlightData } from '../src/models/flightModel'

vi.mock('../src/db.ts')


test('createUser should return the generated user', async () => {
  const flights = {
    name: "flight",
    flight_id: 1,
    takeoff_date_time: 20200101,
    takeoff_airport: "Airport 1",
    landing_date_time: 20200101,
    landing_airport: "Airport 2",
    airplane_id: 1,
  }

  prisma.flight.findUnique.mockResolvedValue(flights)

  const flightsFromModel = await getFlightData('1')

  expect(flightsFromModel).toEqual(flights)
})
