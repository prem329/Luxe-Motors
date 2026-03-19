import { Handler } from "@netlify/functions";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const querySnapshot = await getDocs(collection(db, "customers"));
    const customers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return {
      statusCode: 200,
      body: JSON.stringify(customers),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
      headers: { "Content-Type": "application/json" }
    };
  }
};

export { handler };
