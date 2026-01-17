import fs from 'fs-extra'
import path from 'path'
import fetch from 'node-fetch'

import User from '../models/User.js'
import WardrobeItem from '../models/WardrobeItem.js'
import Outfit from '../models/Outfit.js'

import {sendEmail} from './mailer.js'
import { createPDF } from './pdf.js'
import { zipDirectory } from './zip.js'

const TMP_DIR = path.resolve('tmp/exports')

export const exportUserDataAndEmail = async (userId) => {
  const user = await User.findById(userId)
  if (!user) return

  const exportId = `wardrobe-export-${Date.now()}`
  const baseDir = path.join(TMP_DIR, exportId)

  await fs.ensureDir(baseDir)

  /* ======================
     1. Fetch data
  ====================== */

  const wardrobe = await WardrobeItem.find({ userId }).lean()
  const outfits = await Outfit.find({ userId })
    .populate('items.top items.bottom items.footwear')
    .lean()

  const profile = {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }

  /* ======================
     2. Write JSON
  ====================== */

  await fs.writeJson(path.join(baseDir, 'profile.json'), profile, { spaces: 2 })
  await fs.writeJson(path.join(baseDir, 'wardrobe.json'), wardrobe, { spaces: 2 })
  await fs.writeJson(path.join(baseDir, 'outfits.json'), outfits, { spaces: 2 })

  /* ======================
     3. PDFs
  ====================== */

  await createPDF(path.join(baseDir, 'profile.pdf'), doc => {
    doc.fontSize(16).text('Profile').moveDown()
    doc.fontSize(12)
    doc.text(`Name: ${profile.name}`)
    doc.text(`Email: ${profile.email}`)
    doc.text(`Joined: ${profile.createdAt}`)
  })

  await createPDF(path.join(baseDir, 'wardrobe.pdf'), doc => {
    doc.fontSize(16).text('Wardrobe').moveDown()
    wardrobe.forEach(item => {
      doc
        .fontSize(12)
        .moveDown()
        .text(`Category: ${item.category}`)
        .text(`Brand: ${item.brand || '-'}`)
        .text(`Size: ${item.size || '-'}`)
        .text(`Colors: ${(item.colors || []).join(', ')}`)
    })
  })

  await createPDF(path.join(baseDir, 'outfits.pdf'), doc => {
    doc.fontSize(16).text('Outfits').moveDown()
    outfits.forEach(o => {
      doc
        .fontSize(12)
        .moveDown()
        .text(`Occasion: ${o.occasion || '-'}`)
        .text(`Wear count: ${o.wearCount}`)
        .text(`Last worn: ${o.lastWornAt}`)
    })
  })

  /* ======================
     4. Images
  ====================== */

  const imageDir = path.join(baseDir, 'images')
  await fs.ensureDir(imageDir)

  for (const item of wardrobe) {
    if (!item.imageUrl) continue
    const res = await fetch(item.imageUrl)
    const buffer = await res.buffer()
    await fs.writeFile(path.join(imageDir, `${item._id}.jpg`), buffer)
  }

  /* ======================
     5. Zip
  ====================== */

  const zipPath = path.join(TMP_DIR, `${exportId}.zip`)
  await zipDirectory(baseDir, zipPath)

  /* ======================
     6. Email
  ====================== */

  await sendMail({
    to: user.email,
    subject: 'Your Wardrobe data export',
    text: 'Attached is your complete wardrobe export.',
    attachments: [
      {
        filename: 'wardrobe-export.zip',
        path: zipPath
      }
    ]
  })

  /* ======================
     7. Cleanup
  ====================== */

  await fs.remove(baseDir)
  await fs.remove(zipPath)
}
