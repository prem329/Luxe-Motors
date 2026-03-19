import { Handler } from "@netlify/functions";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const docSnap = await getDoc(doc(db, "settings", "main"));
    if (docSnap.exists()) {
      return {
        statusCode: 200,
        body: JSON.stringify(docSnap.data()),
        headers: { "Content-Type": "application/json" }
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings not found" }),
      };
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

export { handler };
