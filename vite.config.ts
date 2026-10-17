import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

// Aggiunge al server di sviluppo l'indirizzo POST /__shutdown, usato dal
// pulsante "Chiudi" dell'app per spegnere il server.
function shutdownEndpoint(): Plugin {
  return {
    name: 'shutdown-endpoint',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__shutdown', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        res.end('ok')
        setTimeout(() => {
          server.close().finally(() => process.exit(0))
        }, 200)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Su GitHub Pages il sito è servito da /mutuo-immobile/ invece che dalla radice
  base: process.env.GITHUB_PAGES ? '/mutuo-immobile/' : '/',
  plugins: [react(), tailwindcss(), shutdownEndpoint()],
})
