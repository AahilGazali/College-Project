import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../../firebase/config';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const UploadDocuments = () => {
  const { currentUser } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [documentType, setDocumentType] = useState('syllabus');

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  };

  const extractTextFromImage = async (file) => {
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });
      return result.data.text;
    } catch (error) {
      console.error('OCR error:', error);
      throw new Error('Failed to extract text from image');
    }
  };

  const processFile = async (fileObj) => {
    const { file } = fileObj;
    let extractedText = '';

    try {
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        extractedText = await extractTextFromImage(file);
      } else if (file.type === 'text/plain') {
        extractedText = await file.text();
      }

      return extractedText;
    } catch (error) {
      throw error;
    }
  };

  const uploadToFirebase = async (file, extractedText) => {
    const storageRef = ref(storage, `documents/${currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Save document metadata to Firestore
    const docData = {
      userId: currentUser.uid,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      downloadURL,
      extractedText,
      documentType,
      uploadedAt: new Date().toISOString(),
      status: 'processed'
    };

    await addDoc(collection(db, 'documents'), docData);
    return downloadURL;
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setProcessing(true);
    let allExtractedText = '';

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const fileObj = uploadedFiles[i];
        
        // Update status to processing
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'processing', progress: 50 } : f
        ));

        // Extract text
        const text = await processFile(fileObj);
        allExtractedText += text + '\n\n';

        // Upload to Firebase
        await uploadToFirebase(fileObj.file, text);

        // Update status to completed
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'completed', progress: 100 } : f
        ));

        toast.success(`${fileObj.file.name} processed successfully`);
      }

      setExtractedText(allExtractedText);
      toast.success('All files uploaded and processed successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process files. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">
          Upload syllabus and previous year question papers. The system will automatically extract text using OCR.
        </p>
      </div>

      {/* Document Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Type
        </label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="syllabus">Syllabus</option>
          <option value="pyq">Previous Year Questions</option>
          <option value="reference">Reference Material</option>
        </select>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-indigo-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, TXT, PNG, JPG files
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fileObj.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileObj.status === 'pending' && (
                    <span className="text-xs text-gray-500">Pending</span>
                  )}
                  {fileObj.status === 'processing' && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-xs text-blue-500">Processing...</span>
                    </div>
                  )}
                  {fileObj.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={processing}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing files...</span>
              </div>
            ) : (
              'Upload and Process Files'
            )}
          </button>
        </div>
      )}

      {/* Extracted Text Preview */}
      {extractedText && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Extracted Text Preview</h3>
            <button
              onClick={() => setExtractedText('')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments; 