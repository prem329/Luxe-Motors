import { Handler } from "@netlify/functions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST" && event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const booking = JSON.parse(event.body || "{}");
    if (!booking.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Booking ID is required" }),
      };
    }
    
    await updateDoc(doc(db, "bookings", booking.id), booking);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error("Error updating booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

export { handler };
