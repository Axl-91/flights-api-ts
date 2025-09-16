import express from 'express';
import camelcaseKeys from 'camelcase-keys';
import { isHttpError } from 'http-errors';
import { getFlightData } from './models/flightModel';
import { simulateCheckIn } from './checkIn';

const app = express();

app.use(express.json());

app.get('/flights/:id/passengers', async (req, res) => {
  const flightId = req.params.id
  try {
    let flight = await getFlightData(flightId)
    const passengers = await simulateCheckIn(flightId, flight.airplane_id)

    flight = {
      ...flight,
      passengers: passengers
    }

    // flight = camelcaseKeys(flight, { deep: true })

    res.json({
      code: 200,
      data: flight
    });
  } catch (err) {
    if (isHttpError(err)) {
      res
        .status(err.status || 400)
        .json({
          code: err.status || 400,
          data: err.message || {},
        })
    } else {
      res.status(400).json({ code: 400, data: "Unknown error" });
    }
  }
});

app.get('/', async (_req, res) => {
  res.json({
    code: 200,
    message: 'Flight API',
  });
});

// If any other endpoint is used return 404
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Route not found'
  });
});

export default app;

