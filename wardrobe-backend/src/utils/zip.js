import fs from 'fs'
import archiver from 'archiver'

export const zipDirectory = (sourceDir, outPath) =>
  new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } })
    const stream = fs.createWriteStream(outPath)

    archive.directory(sourceDir, false)
    archive.on('error', err => reject(err))

    stream.on('close', resolve)
    archive.pipe(stream)
    archive.finalize()
  })
