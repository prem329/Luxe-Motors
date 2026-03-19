import { Handler } from "@netlify/functions";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST" && event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const settings = JSON.parse(event.body || "{}");
    await setDoc(doc(db, "settings", "main"), settings);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

export { handler };
