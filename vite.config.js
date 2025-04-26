import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from '@svgr/rollup' // Dùng rollup đi
// https://vitejs.dev/config/
export default defineConfig({
  // Cho phép thằng vite sử dụng được process.env, mặc định thì không mà sẽ
  // phải dùng import.meta.env
  difine: {
    'process.env': process.env
  },
  plugins: [react(), svgr()],
  // base: './'
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
