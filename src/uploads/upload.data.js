
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import Student from "../models/validEmail.model.js"; 

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const MONGO_URI = "uri-to-your-mongodb-atlas-cluster"; // Replace with your MongoDB URI

// Connect to MongoDB
await mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('✅ Connected to MongoDB');

// CSV file path
const csvFilePath = path.join(__dirname, 'student_emails.csv');

// Read and insert CSV data
const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    if (row.email && row.course) {
      results.push({ email: row.email.trim(), course: row.course.trim() });
    }
  })
  .on('end', async () => {
    try {
      const inserted = await Student.insertMany(results);
      console.log(`✅ ${inserted.length} students uploaded.`);
      process.exit(0);
    } catch (err) {
      console.error('❌ Error inserting data:', err.message);
      process.exit(1);
    }
  });
