import createHttpError, { isHttpError } from "http-errors";
import dbPool from "../db";
import { RowDataPacket } from "mysql2";

export interface Flight extends RowDataPacket {
  flight_id: number;
  takeoff_date_time: number;
  takeoff_airport: string;
  landing_date_time: number;
  landing_airport: string;
  airplane_id: number;
}

// Get data from the flight correspondant to flight_id
export async function getFlightData(flightId: string): Promise<Flight> {
  try {
    const [rows] = await dbPool.execute<Flight[]>(
      "SELECT * FROM flight WHERE flight_id = ?",
      [flightId],
    );
    const [flightData] = rows;
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
