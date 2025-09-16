import { findBestFreeSeat, getFreeSeat, getSeatNextToAdult } from "./seatsMap.js"

// Assigns a seat to a passengers
function assignSeatToPassenger(passenger, assignedPassengers, seatsMap) {
  const seatId = getFreeSeat(assignedPassengers, seatsMap)
  passenger.seat_id = seatId
  // If cannot assign close to group then assign to any available seat
  if (!seatId) assignSeatsToFreeGroup([passenger], seatsMap)
  assignedPassengers.push(passenger)
}

// Try to assign all kids passengers next to an adult
function assignSeatsToKidsGroup(kidsPassengers, assignedPassengers, seatsMap) {
  for (const kidPassenger of kidsPassengers) {
    const seatId = getSeatNextToAdult(assignedPassengers, seatsMap)
    kidPassenger.seat_id = seatId
    if (seatId) assignedPassengers.push(kidPassenger)
  }
}

// Assign seats to a group of passengers that have someone assigned to a seat
function assignSeatsToFixedGroup(groupPassengers, seatsMap) {
  const assignedPassengers = groupPassengers.filter(p => p.seat_id)
  const adultPassengers = groupPassengers.filter(p => !p.seat_id && p.age >= 18)

  for (const passenger of adultPassengers) {
    // We'll try for every new passeger assigned to assign all the kids passengers  
    const kidsPassengers = groupPassengers.filter(p => !p.seat_id && p.age < 18)
    assignSeatsToKidsGroup(kidsPassengers, assignedPassengers, seatsMap)

    assignSeatToPassenger(passenger, assignedPassengers, seatsMap)
  }

  let kidsPassengers = groupPassengers.filter(p => !p.seat_id && p.age < 18)
  assignSeatsToKidsGroup(kidsPassengers, assignedPassengers, seatsMap)

  // In case that kids can't be assigned next to an adult we are going to assing them as close as we can
  kidsPassengers = groupPassengers.filter(p => !p.seat_id && p.age < 18)
  if (kidsPassengers.length > 0) {
    for (const passenger of kidsPassengers)
      assignSeatToPassenger(passenger, assignedPassengers, seatsMap)
  }
}

// Assign seats to a group of passengers without seats assigned
function assignSeatsToFreeGroup(groupPassengers, seatsMap) {
  const maxSeats = seatsMap.reduce((counter, objRow) => objRow.quantity > counter ? objRow.quantity : counter, 0)
  const maxRow = seatsMap.findIndex(obj => obj.quantity === maxSeats)

  // Assign first adult passenger to the row with the most free seats
  const passenger = groupPassengers.find(p => p.age > 18)
  const freeSeat = findBestFreeSeat(seatsMap[maxRow].seats)
  seatsMap[maxRow].quantity--
  freeSeat.occupied = true
  passenger.seat_id = freeSeat.seat_id

  // If there is no more passengers to assign we stop
  if (groupPassengers.length == 1) return

  // Now assign the rest of the passengers of the group
  // following the logic of fixed groups
  assignSeatsToFixedGroup(groupPassengers, seatsMap)
}

// Take all groups of passengers and assign their seats
export function assignPassengers(sortedPassengers, seatsMap) {
  let passengers = []

  for (const passengersGroup of sortedPassengers) {
    if (passengersGroup.every(p => p.seat_id)) {
      passengers.push(...passengersGroup)
    } else {
      if (passengersGroup.some(p => p.seat_id)) {
        assignSeatsToFixedGroup(passengersGroup, seatsMap)
        passengers.push(...passengersGroup)
      } else {
        assignSeatsToFreeGroup(passengersGroup, seatsMap)
        passengers.push(...passengersGroup)
      }
    }
  }
  return passengers
}

