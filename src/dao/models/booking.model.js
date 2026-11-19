import mongoose from "mongoose";

const bookingServiceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
      required: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    services: { type: [bookingServiceSchema], default: [] },
  },
  { timestamps: true },
);

// Hook del ejercicio. timestamps tambien cubre las actualizaciones por query.
bookingSchema.pre("save", function () {
  this.updatedAt = new Date();
});

export const BookingModel = mongoose.model("bookings", bookingSchema);
