import { getSeatsFromAirplaneWithSeatType } from "../models/seatsModel.js";

// Check if the seat is assigned to some passenger
function checkOccupied(passengers, seatId) {
  return passengers.some(p => p.seat_id === seatId);
}

// Create an array of seats separated by column and storing the quantity of free seats
export async function createSeatsMap(passengers, airplaneId, seatsTypeId) {
  const seats = await getSeatsFromAirplaneWithSeatType(airplaneId, seatsTypeId)
  const grouped = {};

  const allColumns = [...new Set(seats.map(seat => seat.seat_column))].sort();
  const firstCol = allColumns[0].charCodeAt(0);
  const lastCol = allColumns[allColumns.length - 1].charCodeAt(0);

  for (const seat of seats) {
    const row = seat.seat_row;
    const seat_id = seat.seat_id;
    const occupied = checkOccupied(passengers, seat.seat_id);

    if (!grouped[row]) {
      grouped[row] = {
        row,
        seats: [],
        quantity: 0
      };

      // Fill all positions from first to last column with null
      for (let i = firstCol; i <= lastCol; i++) {
        grouped[row].seats.push(null);
      }
    }

    // Calculate the index position for the column and add it to the seats
    const actualCol = seat.seat_column.charCodeAt(0)
    const columnIndex = actualCol - firstCol;
    grouped[row].seats[columnIndex] = { seat_id: seat_id, occupied: occupied };

    // if the seat is free we increment the quantity
    if (!occupied) grouped[row].quantity++;
  }

  const seatMap = Object.values(grouped).sort((a, b) => a.row - b.row);
  return seatMap
}

function seatExists(index, arraySeats) {
  if (index >= 0 && index < arraySeats.length)
    if (arraySeats[index])
      return true
  return false
}

// Given the array of seats from a row it will search for the best seat
// The best seat is the one with the most adjacent unoccupied seats
export function findBestFreeSeat(seats) {
  let bestSeat = null
  let regularFree = null

  for (let i = 0; i < seats.length; i++) {
    if (!seats[i] || seats[i].occupied) continue;
    if (!regularFree) regularFree = seats[i]

    let leftFree = seatExists(i - 1, seats) ? !seats[i - 1].occupied : false;
    let rightFree = seatExists(i + 1, seats) ? !seats[i + 1].occupied : false;

    if (leftFree && rightFree) {
      return seats[i]
    } else if (leftFree || rightFree) {
      bestSeat = seats[i]
    }
  }
  bestSeat = bestSeat ? bestSeat : regularFree
  return bestSeat;
}

// Given a passenger it searchs for it and returns the rown and col where is assigned
export function getRowAndColFromPassenger(passenger, seatsMap) {
  const seatAssigned = passenger.seat_id
  const rowAssigned = seatsMap.findIndex(obj => obj.seats.some(s => s && s.seat_id === seatAssigned))
  const colAssigned = seatsMap[rowAssigned].seats.findIndex(s => s && s.seat_id === seatAssigned)

  return { rowAssigned, colAssigned }
}


// Given a row and column it gets the free seat that is closest to that one
export function getFreeSeat(assignedPassengers, seatsMap) {
  const rowsQuantity = seatsMap.length;
  const seatsQuantity = seatsMap[0].seats.length;

  // Define directions to search
  const directions = [
    { dr: 0, dc: +1 },
    { dr: 0, dc: -1 },
    { dr: +1, dc: 0 },
    { dr: -1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: -1, dc: -1 },
  ];

  // Expand outward with increasing offset
  for (let offset = 1; offset < Math.max(rowsQuantity, seatsQuantity); offset++) {
    for (const { dr, dc } of directions) {
      for (const assignedPassenger of assignedPassengers) {
        const { rowAssigned, colAssigned } = getRowAndColFromPassenger(assignedPassenger, seatsMap)

        const r = rowAssigned + (dr * offset);
        const c = colAssigned + (dc * offset);

        if (r >= 0 && r < rowsQuantity && c >= 0 && c < seatsQuantity) {
          const newSeat = seatsMap[r].seats[c];
          if (newSeat && !newSeat.occupied) {
            seatsMap[r].quantity--
            newSeat.occupied = true;
            return newSeat.seat_id;
          }
        }
      }
    }
  }
}

// Search for a seat that is adjacent to the one assigned to a passenger of their group
export function getSeatNextToAdult(assignedPassengers, seatsMap) {
  const seatsQuantity = seatsMap[0].seats.length;
  const adultAssigned = assignedPassengers.filter(p => p.age > 18)

  // We want directly adjacent so one column at right or one at left
  const adjDirections = [1, -1]

  for (const assignedPassenger of adultAssigned) {
    const { rowAssigned, colAssigned } = getRowAndColFromPassenger(assignedPassenger, seatsMap)

    for (const direction of adjDirections) {
      const newCol = colAssigned + direction
      if (newCol >= 0 && newCol < seatsQuantity) {
        const newSeat = seatsMap[rowAssigned].seats[newCol]
        if (newSeat && !newSeat.occupied) {
          seatsMap[rowAssigned].quantity--
          newSeat.occupied = true;
          return newSeat.seat_id;
        }
      }
    }
  }
}

