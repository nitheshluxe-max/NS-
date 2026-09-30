import JSZip from 'jszip';

// Dynamically bundle all source code files as raw text using Vite's glob import
const sourceFiles = import.meta.glob(
  [
    '/src/**/*.{ts,tsx,css}',
    '/public/**/*.{svg,json}',
    '/index.html',
    '/package.json',
    '/vite.config.ts',
    '/tsconfig.json',
    '/metadata.json',
    '/.env.example'
  ],
  {
    query: '?raw',
    import: 'default',
    eager: true
  }
) as Record<string, string>;

export async function downloadProjectZip(onProgress?: (percent: number) => void): Promise<void> {
  const zip = new JSZip();

  // Add all globbed files
  for (const [filePath, content] of Object.entries(sourceFiles)) {
    // Clean up leading slash to create relative paths inside the ZIP
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    zip.file(cleanPath, content);
  }

  // Include a helpful README.md for local setup
  zip.file(
    'README.md',
    `# NS Properties Portal

Comprehensive Indian Real Estate & Property Search, Buying, Renting, and Listing Portal.

## Quick Start Guide

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18 or later) installed on your computer.

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`

### 5. Publish as Android App (Google Play Store)
You can easily package this PWA using [PWABuilder.com](https://www.pwabuilder.com) into a signed \`.aab\` bundle ready for the Google Play Console.
`
  );

  // Generate the zip binary blob
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  // Trigger browser download
  const url = URL.createObjectURL(zipBlob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'NS-Properties-Complete-App.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
