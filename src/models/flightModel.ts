import createHttpError, { isHttpError } from "http-errors";
import prisma from "../db";
import { Passenger } from "./passengersModel";

export interface Flight {
  flight_id: number;
  takeoff_date_time: number;
  takeoff_airport: string;
  landing_date_time: number;
  landing_airport: string;
  airplane_id: number;
}

export interface FlightResponse {
  flightId: number;
  takeoffDateTime: number;
  takeoffAirport: string;
  landingDateTime: number;
  landingAirport: string;
  airplaneId: number;
  passengers: Passenger[];
}

// Get data from the flight correspondant to flight_id
export async function getFlightData(flightId: string): Promise<Flight> {
  try {
    const flightData: Flight | null = await prisma.flight.findUnique({
      where: { flight_id: Number(flightId) },
    });
    console.log(`FOUND: ${flightData}`)

    if (!flightData) {
      throw createHttpError(404, "{}");
    }

    return flightData;
  } catch (err) {
    if (isHttpError(err)) {
      if (err.status != 404) err.message = "could not connect to db";
      throw err;
    } else {
      throw err;
    }
  }
}
