// E:\trust_website\server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Mock database / static data (falling back to this when Google Drive is not configured)
const localDatabase = {
  developers: [
    {
      id: 1,
      name: "Akhil Kumar Agrawal",
      role: "नमस्ते, मैं विकासकर्ता हूँ",
      description: "मैं एक Frontend डिज़ाइनर हूँ जो सुंदर, आधुनिक और भावनात्मक वेब अनुभव बनाने में विश्वास रखता हूँ।",
      skills: "UI/UX डिज़ाइन, React, HTML5/CSS3, अनुभव-आधारित इंटरफ़ेस और रेस्पॉन्सिव लेआउट",
      email: "akhilme341@gmail.com",
      image: "images/developer/IMG_5408.jpeg"
    },
    {
      id: 2,
      name: "Rohit Sen",
      role: "नमस्ते, मैं सह-विकासकर्ता हूँ",
      description: "मैं एक Backend और Full Stack इंजीनियर हूँ जो तेज़, सुरक्षित और स्केलेबल वेब प्रणालियों का निर्माण करता हूँ।",
      skills: "Node.js, API डेवलपमेंट, डेटाबेस ऑप्टिमाइजेशन, क्लाउड आर्किटेक्चर और सर्वर प्रबंधन",
      email: "rohitsen.dev@gmail.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80"
    }
  ],
  upcomingEvent: {
    title: "रात्री ज्योति उत्सव",
    description: "एक भव्य आध्यात्मिक संध्या, जहाँ दिव्य महाआरती, सुंदर भजनों की श्रृंखला और सामूहिक प्रार्थना की पवित्र ज्योति एक साथ प्रज्वलित होगी।",
    datetime: "तिथि: 15 जुलाई 2026 • समय: शाम 7:00 बजे",
    details: "सामूहिक भक्ति रस, दिव्य ज्योति दर्शन और संपूर्ण परिवार के लिए मंगलमय व पावन वातावरण।",
    image: "https://images.unsplash.com/photo-1509789014768-a42e5bfba444?auto=format&fit=crop&w=1100&q=80"
  },
  pastEvents: [
    {
      title: "प्रकाश संध्या",
      text: "धैर्य, दिव्य संगीत और मानसिक शांति का अलौकिक संगम।",
      popupTitle: "भव्य सफलता",
      popupText: "300 से अधिक श्रद्धालुओं ने भाग लेकर पुण्य अर्जित किया।",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "स्नेह महोत्सव",
      text: "सामूहिक सहयोग, भंडारा और आपसी आत्मीयता का पावन पर्व।",
      popupTitle: "अखंड एकता",
      popupText: "संपूर्ण समाज के सहयोग व स्नेह ने इस उत्सव को सफल बनाया।",
      image: "https://images.unsplash.com/photo-1566908829744-8d4e92ec4a7a?auto=format&fit=crop&w=700&q=80"
    },
    {
      title: "विश्वास पथ",
      text: "एक पावन आध्यात्मिक यात्रा जो श्रद्धालुओं के हृदय में बस गई।",
      popupTitle: "सकारात्मक प्रभाव",
      popupText: "अनेक साधकों ने आध्यात्मिक शांति और आत्म-संतोष पाया।",
      image: "https://images.unsplash.com/photo-1590076214667-c06d7e97a8e2?auto=format&fit=crop&w=700&q=80"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1566908829744-8d4e92ec4a7a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590076214667-c06d7e97a8e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509789014768-a42e5bfba444?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80"
  ]
};

// Initialize Google Drive client
let driveClient = null;

try {
  // Google Drive Authentication using Service Account Credentials
  // Looks for a credentials file defined in .env as GOOGLE_APPLICATION_CREDENTIALS
  // or checks if service account JSON data is supplied via variables
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/drive.readonly']
    );
    driveClient = google.drive({ version: 'v3', auth });
    console.log('Google Drive API client initialized successfully.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    driveClient = google.drive({ version: 'v3', auth });
    console.log('Google Drive API client initialized via JSON Keyfile path.');
  } else {
    console.warn('Google Drive credentials not configured. Running in Fallback Mode.');
  }
} catch (error) {
  console.error('Failed to initialize Google Drive client:', error.message);
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Get Developers List
app.get('/api/developers', (req, res) => {
  res.json(localDatabase.developers);
});

// 2. Get Events List (Upcoming & Past)
app.get('/api/events', (req, res) => {
  res.json({
    upcoming: localDatabase.upcomingEvent,
    past: localDatabase.pastEvents
  });
});

// 3. Get Gallery Images
// If Google Drive folder ID is provided, fetches images dynamically.
// Otherwise, falls back to the static mockup gallery list.
app.get('/api/gallery', async (req, res) => {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (driveClient && folderId) {
    try {
      const response = await driveClient.files.list({
        q: `'${folderId}' in parents and mimeType stripePrefix 'image/' and trashed = false`,
        fields: 'files(id, name, webContentLink, thumbnailLink)',
        pageSize: 30
      });

      const files = response.data.files;
      if (files && files.length > 0) {
        // Map files to client-consumable endpoints (e.g. streaming proxy links)
        const driveImages = files.map(file => `/api/drive-image/${file.id}`);
        return res.json(driveImages);
      }
    } catch (err) {
      console.error('Error fetching files from Google Drive:', err.message);
      // fallback to mock data on API error
    }
  }

  // Fallback
  res.json(localDatabase.gallery);
});

// 4. Stream Image from Google Drive (Proxy)
// This endpoint requests the file from Google Drive and pipes the response directly to the client.
// It avoids exposing API credentials or dealing with CORS, and handles authorization seamlessly.
app.get('/api/drive-image/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  if (!driveClient) {
    res.setHeader('Content-Type', 'image/jpeg');
    return res.sendFile(path.join(__dirname, 'images', 'logo.jpeg'));
  }

  try {
    // Request file from Drive API as a stream
    const response = await driveClient.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // Set content type header based on Drive response headers
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    // Pipe the image data directly to the client
    response.data
      .on('end', () => console.log(`Finished streaming Google Drive file: ${fileId}`))
      .on('error', err => {
        console.error('Error streaming file:', err.message);
        res.setHeader('Content-Type', 'image/jpeg');
        res.sendFile(path.join(__dirname, 'images', 'logo.jpeg'));
      })
      .pipe(res);

  } catch (err) {
    console.error(`Error retrieving Google Drive file (${fileId}):`, err.message);
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, 'images', 'logo.jpeg'));
  }
});

// Catch-all route to serve the frontend for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
