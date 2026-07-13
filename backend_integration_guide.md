# Google Drive & Backend Integration Guide

This guide explains how the Node.js/Express backend fetches dynamic data and streams image assets stored in **Google Drive** directly to your web application, bypassing authorization and CORS issues.

---

## 🏛️ Architectural Overview

```mermaid
sequenceDiagram
    participant User as Frontend Browser
    participant Server as Express Backend
    participant GDrive as Google Drive API

    User->>Server: GET /api/gallery
    Server->>GDrive: List files in Folder ID (Authenticated via Service Account)
    GDrive-->>Server: Return file IDs & Metadata
    Server-->>User: Return list of image URL routes: ["/api/drive-image/ID1", ...]

    Note over User, Server: Browser renders images dynamically
    User->>Server: GET /api/drive-image/ID1
    Server->>GDrive: Download file ID1 (Media Stream)
    GDrive-->>Server: Binary Data Stream
    Server-->>User: Pipe Image Binary Data (Cached & Serviced)
```

---

## 🛠️ Step-by-Step Setup Guide

To load images from your Google Drive folder, follow these steps to connect your backend:

### Step 1: Set Up Google Cloud Platform (GCP)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `Trust Website`).
3. Search for **Google Drive API** in the API Library and click **Enable**.

### Step 2: Create a Service Account (Your Backend's Identity)
1. In the GCP Console, go to **APIs & Services > Credentials**.
2. Click **Create Credentials** and select **Service Account**.
3. Fill in the name (e.g., `drive-reader`) and click **Create and Continue**.
4. Skip optional roles and click **Done**.
5. Click on the newly created Service Account from the list, navigate to the **Keys** tab, and click **Add Key > Create New Key**.
6. Select **JSON** format and click **Create**. This downloads a private credentials file (keep this secure!).

### Step 3: Configure Your Google Drive Folder
1. Open your **Google Drive** and locate/create the folder containing the trust website images.
2. Get the **Folder ID** from the URL:
   * URL format: `https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE`
3. Share the folder:
   * Right-click the folder and select **Share**.
   * Add the **Service Account Email** address (found in your downloaded JSON credentials, ending with `@...gserviceaccount.com`).
   * Grant it **Viewer** permission.

### Step 4: Configure Your Backend Environment
Copy the contents of the downloaded JSON key file into your environment settings.
1. Create a `.env` file in the root directory (based on [.env.example](file:///E:/trust_website/.env.example)).
2. Set either:
   ```env
   # Option A: Path to Keyfile
   GOOGLE_APPLICATION_CREDENTIALS=path/to/downloaded-keyfile.json
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
   ```
   Or set credentials directly:
   ```env
   # Option B: Direct Environment Strings
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourKeyContentHere\n-----END PRIVATE KEY-----\n"
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
   ```

---

## 🖥️ How Frontend Integration Works

Once the backend is configured, instead of hardcoding image URLs in HTML, you update the frontend scripts to fetch the images dynamically:

### Fetching Gallery Images Dynamically

Insert this snippet into your frontend script to populate the marquee with Google Drive images:

```javascript
async function loadGallery() {
  try {
    const response = await fetch('/api/gallery');
    const images = await response.data(); // Returns ["/api/drive-image/ID1", ...]
    
    const track = document.querySelector('.gallery-track');
    track.innerHTML = ''; // Clear fallback images
    
    // We duplicate images to support seamless infinite scrolling
    const imageList = [...images, ...images];
    
    imageList.forEach(imgUrl => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      
      const img = document.createElement('img');
      img.src = imgUrl; // Calls backend proxy route
      img.alt = 'गैलरी चित्र';
      
      card.appendChild(img);
      track.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load gallery from backend:', error);
    // Fallback: the page displays the default hardcoded images
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
```

### Fetching Developers Dynamically

Similarly, you can load the developer profile cards dynamically from `/api/developers`:

```javascript
async function loadDevelopers() {
  try {
    const response = await fetch('/api/developers');
    const developers = await response.json();
    
    const grid = document.querySelector('.dev-grid');
    grid.innerHTML = '';
    
    developers.forEach(dev => {
      const card = `
        <div class="dev-card">
          <div class="dev-profile">
            <img src="${dev.image}" alt="${dev.name}" />
            <div class="dev-info">
              <span class="pill">${dev.name}</span>
              <h2>${dev.role}</h2>
              <p>${dev.description}</p>
              <p><strong>भूमिका:</strong> ${dev.skills}</p>
              <div class="dev-contact">
                <strong>संपर्क सूत्र:</strong>
                <a href="mailto:${dev.email}">✉️ ${dev.email}</a>
              </div>
            </div>
          </div>
        </div>
      `;
      grid.insertAdjacentHTML('beforeend', card);
    });
  } catch (error) {
    console.error('Failed to load developers:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadDevelopers);
```

---

> [!TIP]
> **Performance Optimization**: The backend `/api/drive-image/:fileId` route includes a `Cache-Control` header. This instructs browsers to cache the image binary locally for up to 24 hours, minimizing redundant calls to the Google Drive API and speeding up website loads on repeat visits.

> [!WARNING]
> **API Limits**: The Google Drive API has standard rate-limiting. For a highly trafficked production site, consider setting up a content delivery network (CDN) cache or local storage sync for Drive files.
