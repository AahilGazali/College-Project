import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  Loader2
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
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
    try {
      console.log('=== FIREBASE UPLOAD START ===');
      console.log('File name:', file.name);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);
      console.log('Current user:', currentUser?.uid);
      console.log('Document type:', documentType);
      
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }

      // Test Firebase services
      console.log('Testing Firebase services...');
      console.log('Storage available:', !!storage);
      console.log('Database available:', !!db);
      console.log('Auth available:', !!currentUser);

      // Create a unique filename to avoid conflicts
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `documents/${currentUser.uid}/${uniqueFileName}`);
      
      console.log('Storage reference created:', storageRef.fullPath);
      
      // Upload file to Firebase Storage
      console.log('Starting file upload to Firebase Storage...');
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('File uploaded to Storage successfully:', uploadResult);
      
      // Get download URL
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL obtained:', downloadURL);

      // Save document metadata to Firestore
      const docData = {
        userId: currentUser.uid,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        downloadURL,
        extractedText: extractedText || 'No text extracted',
        documentType,
        uploadedAt: new Date().toISOString(),
        status: 'processed',
        storagePath: storageRef.fullPath
      };

      console.log('Saving to Firestore with data:', docData);
      const docRef = await addDoc(collection(db, 'documents'), docData);
      console.log('Document saved to Firestore with ID:', docRef.id);
      
      console.log('=== FIREBASE UPLOAD SUCCESS ===');
      return { downloadURL, docId: docRef.id };
    } catch (error) {
      console.error('=== FIREBASE UPLOAD ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);
      
      // Check for specific Firebase errors
      if (error.code === 'storage/unauthorized') {
        throw new Error('Storage access denied. Please check Firebase Storage rules.');
      } else if (error.code === 'storage/quota-exceeded') {
        throw new Error('Storage quota exceeded.');
      } else if (error.code === 'storage/retry-limit-exceeded') {
        throw new Error('Upload failed after multiple retries.');
      } else if (error.code === 'firestore/permission-denied') {
        throw new Error('Firestore access denied. Please check Firestore rules.');
      }
      
      throw new Error(`Firebase upload failed: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    console.log('Upload process started');
    console.log('Current user:', currentUser);
    console.log('Uploaded files:', uploadedFiles);
    
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    if (!currentUser?.uid) {
      toast.error('Please log in to upload files');
      return;
    }

    // Test Firebase connection
    try {
      console.log('Testing Firebase connection...');
      console.log('Storage available:', !!storage);
      console.log('Database available:', !!db);
      console.log('User authenticated:', !!currentUser?.uid);
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      toast.error('Firebase connection failed. Please check your configuration.');
      return;
    }

    setProcessing(true);
    let allExtractedText = '';

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const fileObj = uploadedFiles[i];
        console.log(`Processing file ${i + 1}/${uploadedFiles.length}:`, fileObj.file.name);
        
        // Update status to processing
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'processing', progress: 50 } : f
        ));

        // Extract text
        console.log('Extracting text from file...');
        const text = await processFile(fileObj);
        console.log('Text extracted, length:', text.length);
        allExtractedText += text + '\n\n';

                 // Upload to Firebase
         console.log('Uploading to Firebase...');
         try {
           const uploadResult = await uploadToFirebase(fileObj.file, text);
           console.log('Firebase upload completed:', uploadResult);

           // Update status to completed
           setUploadedFiles(prev => prev.map(f => 
             f.id === fileObj.id ? { 
               ...f, 
               status: 'completed', 
               progress: 100,
               docId: uploadResult.docId 
             } : f
           ));

           toast.success(`${fileObj.file.name} uploaded and processed successfully!`);
         } catch (uploadError) {
           console.error('Upload failed for file:', fileObj.file.name, uploadError);
           
           // Update status to failed
           setUploadedFiles(prev => prev.map(f => 
             f.id === fileObj.id ? { 
               ...f, 
               status: 'failed', 
               progress: 0,
               error: uploadError.message
             } : f
           ));
           
           toast.error(`Failed to upload ${fileObj.file.name}: ${uploadError.message}`);
           throw uploadError; // Re-throw to stop processing other files
         }
      }

      setExtractedText(allExtractedText);
      toast.success('All files uploaded and processed successfully! You can now view them in the Question Generator.');
      console.log('All files processed successfully');
      
      // Show success message with option to go to Question Generator
      setTimeout(() => {
        if (window.confirm('Files uploaded successfully! Would you like to go to the Question Generator to use these files?')) {
          window.location.href = '/generate';
        }
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to process files: ${error.message}`);
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
                   {fileObj.status === 'failed' && (
                     <div className="flex items-center space-x-2">
                       <span className="text-xs text-red-500">Failed</span>
                       <span className="text-xs text-red-400" title={fileObj.error}>
                         {fileObj.error?.substring(0, 30)}...
                       </span>
                     </div>
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
             <div className="flex space-x-2">
               <button
                 onClick={() => setExtractedText('')}
                 className="text-sm text-gray-500 hover:text-gray-700"
               >
                 Clear
               </button>
               <button
                 onClick={() => {
                   setUploadedFiles([]);
                   setExtractedText('');
                   toast.success('Ready for new uploads!');
                 }}
                 className="text-sm text-indigo-600 hover:text-indigo-800"
               >
                 Upload More Files
               </button>
               <button
                 onClick={() => window.location.href = '/generate'}
                 className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
               >
                 Go to Question Generator
               </button>
             </div>
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