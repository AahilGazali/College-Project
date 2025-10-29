const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const googleDriveService = require('./googleDriveService');
const { spawnSync } = require('child_process');
const os = require('os');
const https = require('https');
const http = require('http');

// tesseract.js for Node OCR fallback
let Tesseract = null;
try {
  Tesseract = require('tesseract.js');
} catch (e) {
  // tesseract.js not installed or failed to load
  Tesseract = null;
}

/**
 * Download PDF directly from Google Drive public link without API
 * Works for publicly shared files
 */
function downloadFileFromDrive(driveFileId) {
  return new Promise((resolve, reject) => {
    // Direct download URL
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveFileId}`;
    console.log(`📥 Downloading from: ${downloadUrl}`);
    
    https.get(downloadUrl, (response) => {
      console.log(`📥 Response status: ${response.statusCode}`);
      console.log(`📄 Content-Type: ${response.headers['content-type']}`);
      
      // Handle redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`→ Following redirect: ${redirectUrl}`);
        
        // Make new request for the redirect
        https.get(redirectUrl, (redirectResponse) => {
          downloadData(redirectResponse, resolve, reject);
        }).on('error', reject);
        return;
      }
      
      // Download the actual data
      downloadData(response, resolve, reject);
    }).on('error', (error) => {
      console.error(`❌ Download error: ${error.message}`);
      reject(error);
    });
  });
}

function downloadData(response, resolve, reject) {
  const chunks = [];
  let contentLength = 0;
  
  response.on('data', (chunk) => {
    chunks.push(chunk);
    contentLength += chunk.length;
    console.log(`📦 Received ${contentLength} bytes...`);
  });
  
  response.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log(`✅ Download complete: ${buffer.length} bytes`);
    resolve(buffer);
  });
  
  response.on('error', (error) => {
    console.error('❌ Data stream error:', error.message);
    reject(error);
  });
}

/**
 * Extract text & metadata from a Google Drive file and update the Document record.
 * This runs asynchronously and does not block the upload response.
 */
async function processDocumentExtraction(documentId) {
  try {
    const doc = await Document.findById(documentId);
    if (!doc) {
      console.warn('Document not found for extraction:', documentId);
      return;
    }

    // Set status to processing
    doc.processingStatus = 'processing';
    await doc.save();

    let extractedText = '';
    const metadata = {};
    let hasExtractedText = false;

    // If we have a Drive file id, try to download and parse
    let downloadedBuffer = null;
    if (doc.driveFileId) {
      try {
        console.log(`📥 Attempting to download file from Google Drive (Direct Download): ${doc.driveFileId}`);
        downloadedBuffer = await downloadFileFromDrive(doc.driveFileId);
        console.log(`✅ Successfully downloaded ${downloadedBuffer.length} bytes from Google Drive`);

        // Try PDF parse
        try {
          const data = await pdf(downloadedBuffer);
          extractedText = (data && data.text) ? data.text : '';
          if (extractedText && extractedText.trim()) {
            hasExtractedText = true;
            metadata.pages = data && data.numpages ? data.numpages : undefined;
            metadata.extraction_method = 'pdf-parse-direct';
            console.log(`✅ PDF text extracted successfully from Drive (${extractedText.length} characters)`);
          } else {
            console.warn('⚠️ Downloaded file has no extractable text (might be image-only)');
          }
        } catch (errParse) {
          console.error('❌ pdf-parse error:', errParse.message || errParse);
        }
      } catch (errDownload) {
        console.error('❌ Failed to download file from Google Drive:', errDownload.message || errDownload);
        console.error('   Make sure the Google Drive file is publicly accessible');
      }
    }

    // Fallback: if no text extracted but a local filePath exists on the document, try reading it
    if ((!extractedText || !extractedText.trim()) && doc.filePath) {
      try {
        const b = fs.readFileSync(doc.filePath);
        const data = await pdf(b);
        extractedText = data && data.text ? data.text : extractedText;
        metadata.pages = metadata.pages || data && data.numpages ? data.numpages : metadata.pages;
        metadata.extraction_method = metadata.extraction_method || 'pdf-parse-local';
      } catch (errLocal) {
        console.error('Local pdf-parse fallback error:', errLocal.message || errLocal);
      }
    }

    // OCR fallback: if still empty, try converting PDF to images and run tesseract.js (if available)
    if ((!extractedText || !extractedText.trim())) {
      // Create a temporary file path to store pdf if we have buffer
      let tempPdfPath = null;
      try {
        if (downloadedBuffer) {
          // Use the already-downloaded buffer from Drive
          tempPdfPath = path.join(os.tmpdir(), `doc-${doc._id}-${Date.now()}.pdf`);
          fs.writeFileSync(tempPdfPath, downloadedBuffer);
          console.log('📁 Saved downloaded buffer to temp file for OCR processing');
        } else if (doc.filePath) {
          tempPdfPath = doc.filePath;
        }

        if (tempPdfPath) {
          // Try pdftoppm (poppler) to convert to PNG pages
          try {
            const outPrefix = path.join(os.tmpdir(), `pages-${doc._id}-${Date.now()}`);
            const args = ['-png', tempPdfPath, outPrefix];
            const res = spawnSync('pdftoppm', args, { encoding: 'utf8' });
            if (res.error) {
              throw res.error;
            }

            // pdftoppm will create files like outPrefix-1.png, outPrefix-2.png ...
            // Gather generated files
            const dir = path.dirname(outPrefix);
            const base = path.basename(outPrefix);
            const images = fs.readdirSync(dir)
              .filter(f => f.startsWith(base) && f.endsWith('.png'))
              .map(f => path.join(dir, f))
              .sort();

            if (images.length > 0 && Tesseract) {
              let ocrText = '';
              for (const imgPath of images) {
                try {
                  const { data: { text } } = await Tesseract.recognize(imgPath, 'eng');
                  ocrText += (text || '') + '\n';
                } catch (ocrErr) {
                  console.error('tesseract.js OCR error for', imgPath, ocrErr.message || ocrErr);
                }
              }

              if (ocrText && ocrText.trim()) {
                extractedText = ocrText;
                metadata.extraction_method = 'tesseract.js';
              }
            }

            // cleanup images
            try {
              for (const img of fs.readdirSync(dir)) {
                if (img.startsWith(base) && img.endsWith('.png')) {
                  fs.unlinkSync(path.join(dir, img));
                }
              }
            } catch (cleanupErr) {
              // non-fatal
            }
          } catch (popplerErr) {
            console.warn('pdftoppm not available or conversion failed, will call python worker fallback:', popplerErr.message || popplerErr);
            // Fall back to python worker (pdf_processor.py) for robust OCR
              try {
                const workerDir = path.join(__dirname, 'pdf_extractor');
                const workerPath = path.join(workerDir, 'pdf_processor.py');
                // Use the virtual environment Python if it exists
                const venvPython = path.join(workerDir, '.venv', 'Scripts', 'python.exe');
                const python = fs.existsSync(venvPython) ? venvPython : (process.env.PYTHON || 'python');
                const args = ['pdf_processor.py', '--local-path', tempPdfPath];
                const spawnRes = spawnSync(python, args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, cwd: workerDir });
              if (spawnRes.error) throw spawnRes.error;
              if (spawnRes.status !== 0) {
                console.error('Python worker failed:', spawnRes.stderr || spawnRes.stdout);
              } else {
                const out = spawnRes.stdout || '';
                try {
                  const jobRes = JSON.parse(out);
                  if (jobRes && jobRes.success) {
                    extractedText = jobRes.text || '';
                    if (jobRes.metadata) {
                      metadata.pageCount = jobRes.metadata.pages || metadata.pageCount;
                      metadata.extraction_method = jobRes.metadata.extraction_method || 'python-worker';
                      if (jobRes.metadata.title) metadata.title = jobRes.metadata.title;
                    }
                  } else {
                    console.error('Python worker returned failure:', jobRes);
                  }
                } catch (jsonErr) {
                  console.error('Failed to parse python worker output', jsonErr.message || jsonErr);
                }
              }
            } catch (pyErr) {
              console.error('Python worker fallback error:', pyErr.message || pyErr);
            }
          }
        }
      } catch (e) {
        console.error('OCR fallback error:', e.message || e);
      } finally {
        // cleanup temp pdf if we created one
        try {
          if (tempPdfPath && tempPdfPath.includes(os.tmpdir()) && fs.existsSync(tempPdfPath) && tempPdfPath !== doc.filePath) {
            fs.unlinkSync(tempPdfPath);
          }
        } catch (cleanupErr) {
          // ignore
        }
      }
    }

    // Save results to document
    doc.extractedText = extractedText || '';
    doc.metadata = doc.metadata || {};
    doc.metadata.pageCount = metadata.pageCount || metadata.pages || doc.metadata.pageCount || null;
    doc.metadata.wordCount = extractedText ? extractedText.split(/\s+/).length : 0;
    doc.metadata.extraction_method = metadata.extraction_method || 'unknown';
    doc.metadata.extractedAt = new Date();

    // Extract and save topics from the extracted text
    if (extractedText && extractedText.trim()) {
      doc.topics = doc.extractTopics();
      doc.processingStatus = 'completed';
      doc.processingError = null;
      console.log(`✅ Extraction completed for document ${documentId} (${doc.metadata.wordCount} words extracted)`);
    } else {
      // No text extracted - mark as failed
      doc.processingStatus = 'failed';
      doc.processingError = 'No text content could be extracted from the PDF. The PDF might be image-only without OCR, or there was an error accessing the file.';
      console.warn(`⚠️ Extraction failed for document ${documentId}: No text content extracted`);
    }

    await doc.save();
  } catch (error) {
    console.error('Error in processDocumentExtraction:', error.message || error);
    try {
      await Document.findByIdAndUpdate(documentId, {
        processingStatus: 'failed',
        processingError: error.message || String(error)
      });
    } catch (e) {
      console.error('Failed to update document processing status after error:', e.message || e);
    }
  }
}

module.exports = {
  processDocumentExtraction
};
