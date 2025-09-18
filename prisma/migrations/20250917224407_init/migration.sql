-- CreateTable
CREATE TABLE "public"."Airplane" (
    "airplane_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Airplane_pkey" PRIMARY KEY ("airplane_id")
);

-- CreateTable
CREATE TABLE "public"."Flight" (
    "flight_id" SERIAL NOT NULL,
    "takeoff_date_time" INTEGER NOT NULL,
    "takeoff_airport" TEXT NOT NULL,
    "landing_date_time" INTEGER NOT NULL,
    "landing_airport" TEXT NOT NULL,
    "airplane_id" INTEGER NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("flight_id")
);

-- CreateTable
CREATE TABLE "public"."Passenger" (
    "passenger_id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("passenger_id")
);

-- CreateTable
CREATE TABLE "public"."Purchase" (
    "purchase_id" SERIAL NOT NULL,
    "purchase_date" INTEGER NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "public"."Seat" (
    "seat_id" SERIAL NOT NULL,
    "seat_column" TEXT NOT NULL,
    "seat_row" INTEGER NOT NULL,
    "seat_type_id" INTEGER NOT NULL,
    "airplane_id" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "public"."SeatType" (
    "seat_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SeatType_pkey" PRIMARY KEY ("seat_type_id")
);

-- CreateTable
CREATE TABLE "public"."BoardingPass" (
    "boarding_pass_id" SERIAL NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "seat_type_id" INTEGER NOT NULL,
    "seat_id" INTEGER,
    "flight_id" INTEGER NOT NULL,

    CONSTRAINT "BoardingPass_pkey" PRIMARY KEY ("boarding_pass_id")
);

-- CreateIndex
CREATE INDEX "airplane_id_fl" ON "public"."Flight"("airplane_id");

-- CreateIndex
CREATE INDEX "seat_type_id_se" ON "public"."Seat"("seat_type_id");

-- CreateIndex
CREATE INDEX "airplane_id_se" ON "public"."Seat"("airplane_id");

-- CreateIndex
CREATE INDEX "purchase_id_bp" ON "public"."BoardingPass"("purchase_id");

-- CreateIndex
CREATE INDEX "passenger_id_bp" ON "public"."BoardingPass"("passenger_id");

-- CreateIndex
CREATE INDEX "seat_type_id_bp" ON "public"."BoardingPass"("seat_type_id");

-- CreateIndex
CREATE INDEX "flight_id_bp" ON "public"."BoardingPass"("flight_id");

-- CreateIndex
CREATE INDEX "seat_id_bp" ON "public"."BoardingPass"("seat_id");

-- AddForeignKey
ALTER TABLE "public"."Flight" ADD CONSTRAINT "Flight_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "public"."Airplane"("airplane_id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_seat_type_id_fkey" FOREIGN KEY ("seat_type_id") REFERENCES "public"."SeatType"("seat_type_id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."Seat" ADD CONSTRAINT "Seat_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "public"."Airplane"("airplane_id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."BoardingPass" ADD CONSTRAINT "BoardingPass_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "public"."Purchase"("purchase_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardingPass" ADD CONSTRAINT "BoardingPass_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "public"."Passenger"("passenger_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardingPass" ADD CONSTRAINT "BoardingPass_seat_type_id_fkey" FOREIGN KEY ("seat_type_id") REFERENCES "public"."SeatType"("seat_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardingPass" ADD CONSTRAINT "BoardingPass_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "public"."Seat"("seat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardingPass" ADD CONSTRAINT "BoardingPass_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "public"."Flight"("flight_id") ON DELETE CASCADE ON UPDATE RESTRICT;
