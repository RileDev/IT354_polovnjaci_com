import fs from "fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const picturesDir = path.resolve(__dirname, "public", "pictures")

const ensurePicturesDir = () => {
  if (!fs.existsSync(picturesDir)) {
    fs.mkdirSync(picturesDir, { recursive: true })
  }
}

const safeBasename = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

const dataUrlToBuffer = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+?);base64,(.*)$/)
  if (!match) return null
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "local-image-upload",
      configureServer(server) {
        ensurePicturesDir()

        server.middlewares.use("/__upload", (req, res, next) => {
          if (req.method !== "POST") {
            next()
            return
          }

          const chunks: Buffer[] = []
          req.on("data", (chunk) => chunks.push(chunk))
          req.on("end", () => {
            try {
              const raw = Buffer.concat(chunks).toString("utf8")
              const payload = JSON.parse(raw) as {
                files?: Array<{ name: string; dataUrl: string }>
              }

              if (!payload.files || payload.files.length === 0) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: "No files received." }))
                return
              }

              const urls: string[] = []
              for (const file of payload.files) {
                const converted = dataUrlToBuffer(file.dataUrl)
                if (!converted) continue

                const extFromMime = converted.mime.split("/")[1] || "png"
                const baseName = safeBasename(
                  path.parse(file.name).name || "image"
                )
                const unique = `${Date.now()}-${Math.random()
                  .toString(36)
                  .slice(2, 8)}`
                const filename = `${baseName}-${unique}.${extFromMime}`
                const fullPath = path.join(picturesDir, filename)

                fs.writeFileSync(fullPath, converted.buffer)
                urls.push(`/pictures/${filename}`)
              }

              res.setHeader("Content-Type", "application/json")
              res.end(JSON.stringify({ urls }))
            } catch (error) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: "Upload failed." }))
            }
          })
        })
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
