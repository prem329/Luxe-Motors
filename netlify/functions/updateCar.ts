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
    const car = JSON.parse(event.body || "{}");
    if (!car.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Car ID is required" }),
      };
    }
    
    await updateDoc(doc(db, "cars", car.id), car);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error("Error updating car:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

export { handler };
