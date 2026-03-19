import { Handler } from "@netlify/functions";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
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
    
    await setDoc(doc(db, "bookings", booking.id), booking);

    // Also try to add the customer if they don't exist
    const customerId = `c_${booking.email.replace(/[^a-zA-Z0-9]/g, '')}`;
    try {
      await setDoc(doc(db, 'customers', customerId), {
        id: customerId,
        name: booking.name,
        email: booking.email,
        phone: booking.mobile,
        registeredAt: new Date().toISOString()
      }, { merge: true }); // Merge instead of overwrite so we don't lose past info
    } catch (e) {
      console.log("Customer merge failed, possibly already exists or permissions issues");
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error("Error adding booking:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

export { handler };
