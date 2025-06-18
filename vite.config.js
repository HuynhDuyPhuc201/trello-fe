import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from '@svgr/rollup' // Dùng rollup đi
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  // Cho phép thằng vite sử dụng được process.env, mặc định thì không mà sẽ
  // phải dùng import.meta.env
  define: {
    'process.env': process.env
  },
  // plugins: [react(), svgr()],
  plugins: [react(), visualizer({ open: true })],
  base: './',
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  // server: {
  //   historyApiFallback: true, // 👈 Cái này rất quan trọng để fix lỗi F5
  //   port: 3000 // Hoặc port khác tuỳ em
  // },
  build: {
    outDir: 'dist' // default là dist
  }
})
