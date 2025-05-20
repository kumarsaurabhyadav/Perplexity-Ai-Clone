import axios from "axios";

export async function POST(req) {
  try {
    const { runId } = await req.json();

    if (!runId) {
      return new Response("Missing runId", { status: 400 });
    }

    console.log("INNGEST_SERVER_HOST:", process.env.INNGEST_SERVER_HOST);
    console.log("INNGEST_SIGNING_KEY:", process.env.INNGEST_SIGNING_KEY);

    const result = await axios.get(
      `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`
        }
      }
    );

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("INNGEST STATUS API ERROR:", err.message, err.stack);
    return new Response("Internal Server Error", { status: 500 });
  }
}