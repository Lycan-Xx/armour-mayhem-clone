import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: [
      "f83a00fc-44ca-43c7-b5f5-cdc115750140-00-1r55vhssli5hv.kirk.repl.co",
    ],
    hmr: { clientPort: 443, protocol: "wss" },
  },
});
