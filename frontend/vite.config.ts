import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  define: {
    "__REACT_QUERY_STATE_TRANSITION__": "true",
    "__REACT_ROUTER_FUTURE_FLAGS__": JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }),
  },
});