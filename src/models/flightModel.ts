import createHttpError, { isHttpError } from "http-errors";
import dbPool from "../db";

// Get data from the flight correspondant to flight_id
export async function getFlightData(flightId: string) {

  try {
    const [rows, _fields] = await dbPool.execute(
      'SELECT * FROM flight WHERE flight_id = ?',
      [flightId]
    )
    const flightData = rows;

    if (!flightData) {
      throw createHttpError(404, '{}')
    }
    return flightData
  } catch (err) {
    if (isHttpError(err)) {
      if (err.status != 404)
        err.message = "could not connect to db"
      throw err;
    } else {
      throw err
    }
  }
}
