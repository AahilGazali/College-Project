# Google Drive Integration Setup Guide

## 🚀 Setting Up Google Drive Storage

This guide will help you set up Google Drive integration for storing uploaded PDFs and documents in the cloud instead of locally on the server.

### Prerequisites

- Google account
- Google Cloud Console access
- Node.js backend running

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a project" → "New Project"
   - Enter project name: "Question Paper Generator"
   - Click "Create"

### Step 2: Enable Google Drive API

1. **Navigate to APIs & Services**
   - In the Google Cloud Console, go to "APIs & Services" → "Library"

2. **Search for Google Drive API**
   - Search for "Google Drive API"
   - Click on it and press "Enable"

### Step 3: Create Service Account

1. **Go to Credentials**
   - Navigate to "APIs & Services" → "Credentials"

2. **Create Service Account**
   - Click "Create Credentials" → "Service Account"
   - Enter service account name: "question-paper-drive-service"
   - Enter description: "Service account for document storage"
   - Click "Create and Continue"

3. **Assign Roles**
   - Role: "Editor" (or "Storage Admin" if available)
   - Click "Continue" → "Done"

### Step 4: Generate Service Account Key

1. **Find Your Service Account**
   - In Credentials page, find your service account
   - Click on the service account email

2. **Create Key**
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Click "Create"

3. **Download Key File**
   - The JSON file will be downloaded automatically
   - Rename it to `google-drive-key.json`
   - Place it in your `server/` directory

### Step 5: Configure Environment Variables

Add these variables to your `server/.env` file:

```env
# Google Drive Configuration
GOOGLE_DRIVE_KEY_FILE=./google-drive-key.json
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

### Step 6: Create Drive Folder (Optional)

1. **Create a folder in Google Drive**
   - Go to [Google Drive](https://drive.google.com/)
   - Create a new folder named "Question Paper Documents"

2. **Get Folder ID**
   - Right-click the folder → "Share"
   - Copy the folder ID from the URL
   - Add it to your `.env` file as `GOOGLE_DRIVE_FOLDER_ID`

### Step 7: Test the Integration

1. **Start your server**
   ```bash
   cd server
   node server.js
   ```

2. **Upload a document**
   - Go to your frontend upload page
   - Upload a PDF file
   - Check the server logs for success messages

### Step 8: Verify Storage

1. **Check Google Drive**
   - Go to your Google Drive
   - Look for uploaded files in the folder

2. **Check Database**
   - Your MongoDB should now contain documents with `driveLink` and `driveFileId` fields

## 🔧 How It Works

### Upload Process:
1. **File Upload**: User uploads PDF via frontend
2. **Cloud Storage**: File is uploaded to Google Drive
3. **Database Storage**: Drive link and file ID are saved in MongoDB
4. **Access**: Users can view/download files via drive links

### Database Schema:
```javascript
{
  title: "Syllabus Document",
  driveLink: "https://drive.google.com/file/d/1ABC.../view",
  driveFileId: "1ABC...",
  fileName: "syllabus.pdf",
  // ... other fields
}
```

### Benefits:
- ✅ **Cloud Storage**: Files stored in Google Drive
- ✅ **Scalability**: No server storage limitations
- ✅ **Accessibility**: Files accessible from anywhere
- ✅ **Backup**: Automatic Google Drive backup
- ✅ **Sharing**: Easy file sharing via drive links

## 🛠️ Alternative Cloud Storage Options

If you prefer other cloud storage services:

### AWS S3
```bash
npm install aws-sdk
```

### Azure Blob Storage
```bash
npm install @azure/storage-blob
```

### Dropbox
```bash
npm install dropbox
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Google Drive API not initialized"**
   - Check if `google-drive-key.json` exists in server directory
   - Verify the JSON file is valid
   - Check file permissions

2. **"Permission denied"**
   - Ensure service account has proper roles
   - Check if Google Drive API is enabled

3. **"File upload failed"**
   - Check internet connection
   - Verify service account credentials
   - Check file size limits

### Debug Mode:
Set `NODE_ENV=development` in your `.env` file to see detailed error messages.

## 📝 Security Notes

- **Keep credentials secure**: Never commit `google-drive-key.json` to version control
- **Use environment variables**: Store sensitive data in `.env` file
- **Regular rotation**: Rotate service account keys periodically
- **Access control**: Limit service account permissions to minimum required

## 🎉 Success!

Once configured, your uploaded PDFs will be stored in Google Drive with shareable links saved in MongoDB. Users can access files directly through the drive links, and the system will automatically handle file management.

Your question paper generator now has cloud storage capabilities! 🚀
