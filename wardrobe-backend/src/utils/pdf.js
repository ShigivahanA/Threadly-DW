import fs from 'fs-extra'
import PDFDocument from 'pdfkit'

export const createPDF = (filePath, writer) =>
  new Promise(resolve => {
    const doc = new PDFDocument({ margin: 40 })
    const stream = fs.createWriteStream(filePath)

    doc.pipe(stream)
    writer(doc)
    doc.end()

    stream.on('finish', resolve)
  })
