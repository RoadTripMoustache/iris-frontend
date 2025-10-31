import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
    const name = event.context.params?.name || ""
    if (name == "") {
        return "";
    }

    const filePath = join(process.cwd(), 'server/files', name)

    if (!existsSync(filePath)) {
        throw createError({ statusCode: 404, statusMessage: 'JSON file not found' })
    }

    const content = readFileSync(filePath, 'utf-8')
    setHeader(event, 'Content-Type', 'application/json')
    return JSON.parse(content)
})
