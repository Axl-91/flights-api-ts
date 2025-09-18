import app from "./app";
import { PORT } from "./config";
import prisma from "./db";

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
});

const shutdown = async () => {
  console.log("\n🛑 Shutting down server...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown;
});

process.on("SIGTERM", () => {
  void shutdown;
});
