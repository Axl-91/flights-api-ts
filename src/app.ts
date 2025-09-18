import express from "express";
import camelcaseKeys from "camelcase-keys";
import { isHttpError } from "http-errors";
import { FlightResponse, getFlightData } from "./models/flightModel";
import { simulateCheckIn } from "./checkIn";

const app = express();

app.use(express.json());

app.get("/flights/:id/passengers", async (req, res) => {
  const flightId = req.params.id;
  try {
    const flight = await getFlightData(flightId);
    const passengers = await simulateCheckIn(flightId, flight.airplane_id);

    const flightWithPassengers = {
      ...flight,
      passengers: passengers,
    };

    const flightResponse: FlightResponse = camelcaseKeys(flightWithPassengers, {
      deep: true,
    });

    res.json({
      code: 200,
      data: flightResponse,
    });
  } catch (err) {
    if (isHttpError(err)) {
      res.status(err.status || 400).json({
        code: err.status || 400,
        data: err.message || {},
      });
    } else {
      console.error(err);
      res.status(400).json({ code: 400, data: "Unknown error" });
    }
  }
});

app.get("/", (_req, res) => {
  res.json({
    code: 200,
    message: "Flight API",
  });
});

// If any other endpoint is used return 404
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    message: "Route not found",
  });
});

export default app;
