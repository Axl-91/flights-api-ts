import { RowDataPacket } from "mysql2";
import dbPool from "../db.js";

export interface Seat extends RowDataPacket {
  seat_id: number,
  seat_column: string,
  seat_row: number
}

// Get all the seats from the selected airplane_id and seat_type_id
export async function getSeatsFromAirplaneWithSeatType(airplaneId: string, typeId: number) {
  try {
    let [seatsData] = await dbPool.execute<Seat[]>(
      `SELECT seat_id, seat_column, seat_row
      FROM seat WHERE airplane_id = ? AND seat_type_id = ?
      ORDER BY seat_column, seat_row`,
      [airplaneId, typeId]
    )
    return seatsData
  } catch (err) {
    console.error(err)
    throw err
  }
}
