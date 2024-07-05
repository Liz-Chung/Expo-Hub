import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path"; 

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'components': path.resolve(__dirname, './src/components'),
        'modals': path.resolve(__dirname, './src/modals'),
        'stores': path.resolve(__dirname, './src/stores'),
        'pages': path.resolve(__dirname, './src/pages'),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_MOCKUP_EXPO_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
          secure: false,
          ws: true,
        },
        "/kakaoLogin": {
          target: env.VITE_BACKEND_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/kakaoLogin/, "/api/kakaoLogin"),
        },
      },
    },
  };
});
