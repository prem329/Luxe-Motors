import { Handler } from "@netlify/functions";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST" && event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { id } = JSON.parse(event.body || "{}");
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Car ID is required" }),
      };
    }
    
    await deleteDoc(doc(db, "cars", id));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error("Error deleting car:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

export { handler };
