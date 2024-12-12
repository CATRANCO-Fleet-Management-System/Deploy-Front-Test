// utils/echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Check if window is available (to ensure this runs in the browser only)
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const echo = typeof window !== "undefined"
  ? new Echo({
      broadcaster: "pusher",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY, // Use environment variables
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: true,
      encrypted: true,
    })
  : null;

export default echo;
