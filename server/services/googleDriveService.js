const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.initializeDrive();
  }

  async initializeDrive() {
    try {
      // Initialize Google Drive API
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_DRIVE_KEY_FILE || './google-drive-key.json',
        scopes: ['https://www.googleapis.com/auth/drive.file']
      });

      this.drive = google.drive({ version: 'v3', auth });
      console.log('✅ Google Drive API initialized');
    } catch (error) {
      console.error('❌ Google Drive API initialization failed:', error.message);
      console.log('📝 To use Google Drive storage:');
      console.log('1. Create a Google Cloud Project');
      console.log('2. Enable Google Drive API');
      console.log('3. Create a service account');
      console.log('4. Download the JSON key file');
      console.log('5. Set GOOGLE_DRIVE_KEY_FILE in .env');
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType, folderId = null) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive API not initialized');
      }

      const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : []
      };

      const media = {
        mimeType: mimeType,
        body: fileBuffer
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,webContentLink'
      });

      // Make the file publicly viewable
      await this.drive.permissions.create({
        fileId: response.data.id,
        resource: {
          role: 'reader',
          type: 'anyone'
        }
      });

      return {
        fileId: response.data.id,
        fileName: response.data.name,
        driveLink: response.data.webViewLink,
        downloadLink: response.data.webContentLink
      };
    } catch (error) {
      console.error('Google Drive upload error:', error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive API not initialized');
      }

      await this.drive.files.delete({
        fileId: fileId
      });

      return true;
    } catch (error) {
      console.error('Google Drive delete error:', error);
      throw error;
    }
  }

  async getFileInfo(fileId) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive API not initialized');
      }

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,size,mimeType,webViewLink,webContentLink'
      });

      return response.data;
    } catch (error) {
      console.error('Google Drive get file info error:', error);
      throw error;
    }
  }

  // Download a file from Google Drive and return a Buffer
  async downloadFile(fileId) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive API not initialized');
      }

      const response = await this.drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      return await new Promise((resolve, reject) => {
        const chunks = [];
        response.data.on('data', (chunk) => chunks.push(chunk));
        response.data.on('end', () => resolve(Buffer.concat(chunks)));
        response.data.on('error', (err) => reject(err));
      });
    } catch (error) {
      console.error('Google Drive download error:', error);
      throw error;
    }
  }

  async createFolder(folderName, parentFolderId = null) {
    try {
      if (!this.drive) {
        throw new Error('Google Drive API not initialized');
      }

      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : []
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: 'id,name'
      });

      return {
        folderId: response.data.id,
        folderName: response.data.name
      };
    } catch (error) {
      console.error('Google Drive create folder error:', error);
      throw error;
    }
  }
}

module.exports = new GoogleDriveService();
