import pdfplumber
import pytesseract
from pdf2image import convert_from_path
import pymongo
import os
import logging
from typing import Dict, List, Optional
import numpy as np
from PIL import Image
import cv2
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PDFExtractor:
    def __init__(self, mongodb_uri: str, database_name: str):
        """Initialize the PDF Extractor with MongoDB connection."""
        self.client = pymongo.MongoClient(mongodb_uri)
        self.db = self.client[database_name]
        self.documents = self.db.documents
        
        # Configure Tesseract path (update this path based on your installation)
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        # Initialize Google Drive credentials
        self.credentials = None
        self.SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
        self.load_credentials()

    def load_credentials(self):
        """Load or create Google Drive credentials."""
        creds = None
        creds_path = 'server/google-drive-key.json'
        token_path = 'token.json'
        
        if os.path.exists(token_path):
            with open(token_path, 'r') as token:
                creds = Credentials.from_authorized_user_file(token_path, self.SCOPES)
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(creds_path, self.SCOPES)
                creds = flow.run_local_server(port=0)
            
            with open(token_path, 'w') as token:
                token.write(creds.to_json())
        
        self.credentials = creds

    def download_from_drive(self, file_id: str) -> str:
        """Download file from Google Drive and save locally."""
        try:
            service = build('drive', 'v3', credentials=self.credentials)
            request = service.files().get_media(fileId=file_id)
            
            file_metadata = service.files().get(fileId=file_id).execute()
            file_name = file_metadata.get('name', 'downloaded_file.pdf')
            
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            
            while done is False:
                status, done = downloader.next_chunk()
                logger.info(f"Download {int(status.progress() * 100)}%")
            
            local_path = f"server/uploads/documents/{file_name}"
            with open(local_path, 'wb') as f:
                f.write(fh.getvalue())
            
            return local_path
            
        except Exception as e:
            logger.error(f"Error downloading file from Drive: {str(e)}")
            raise

    def preprocess_image(self, image: Image) -> Image:
        """Apply image preprocessing for better OCR accuracy."""
        # Convert PIL Image to OpenCV format
        img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Apply adaptive thresholding
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(thresh)
        
        # Convert back to PIL Image
        return Image.fromarray(denoised)

    def extract_text_from_pdf(self, pdf_path: str) -> Dict[str, str]:
        """Extract text from PDF using multiple methods for high accuracy."""
        extracted_data = {
            'text': '',
            'metadata': {},
            'tables': []
        }
        
        try:
            # Method 1: Direct PDF text extraction
            with pdfplumber.open(pdf_path) as pdf:
                extracted_data['metadata'] = {
                    'pages': len(pdf.pages),
                    'title': os.path.basename(pdf_path)
                }
                
                for page in pdf.pages:
                    # Extract text
                    text = page.extract_text()
                    if text:
                        extracted_data['text'] += text + '\n'
                    
                    # Extract tables
                    tables = page.extract_tables()
                    if tables:
                        extracted_data['tables'].extend(tables)
            
            # Method 2: OCR for scanned documents
            if not extracted_data['text'].strip():
                logger.info("No text found directly, attempting OCR...")
                images = convert_from_path(pdf_path)
                ocr_text = ''
                
                for image in images:
                    # Preprocess image
                    processed_image = self.preprocess_image(image)
                    
                    # Perform OCR with custom configuration
                    custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
                    page_text = pytesseract.image_to_string(
                        processed_image, 
                        config=custom_config,
                        lang='eng'
                    )
                    ocr_text += page_text + '\n'
                
                extracted_data['text'] = ocr_text
                extracted_data['metadata']['extraction_method'] = 'ocr'
            else:
                extracted_data['metadata']['extraction_method'] = 'direct'
            
            return extracted_data
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise

    def process_drive_file(self, file_id: str) -> Dict[str, any]:
        """Process a Google Drive PDF file and store in MongoDB."""
        try:
            # Download the file
            local_path = self.download_from_drive(file_id)
            
            # Extract text
            extracted_data = self.extract_text_from_pdf(local_path)
            
            # Store in MongoDB
            document = {
                'fileId': file_id,
                'localPath': local_path,
                'extractedText': extracted_data['text'],
                'metadata': extracted_data['metadata'],
                'tables': extracted_data['tables'],
                'processingStatus': 'completed',
                'accuracy': self.estimate_accuracy(extracted_data)
            }
            
            result = self.documents.insert_one(document)
            
            # Clean up local file
            if os.path.exists(local_path):
                os.remove(local_path)
            
            return {
                'success': True,
                'documentId': str(result.inserted_id),
                'metadata': extracted_data['metadata']
            }
            
        except Exception as e:
            logger.error(f"Error processing Drive file: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    def estimate_accuracy(self, extracted_data: Dict) -> float:
        """Estimate the extraction accuracy based on various metrics."""
        metrics = []
        
        # Text presence score
        text_length = len(extracted_data['text'].strip())
        if text_length > 0:
            metrics.append(min(1.0, text_length / 1000))  # Normalize to max 1.0
        
        # OCR confidence (if OCR was used)
        if extracted_data['metadata'].get('extraction_method') == 'ocr':
            # Use a base OCR confidence of 0.85 for successful extraction
            metrics.append(0.85)
        else:
            # Direct extraction usually has higher confidence
            metrics.append(0.95)
        
        # Content structure score
        lines = extracted_data['text'].split('\n')
        if len(lines) > 5:  # Check if content has reasonable structure
            metrics.append(0.90)
        
        # Calculate final accuracy
        if metrics:
            accuracy = sum(metrics) / len(metrics)
            return round(accuracy * 100, 2)  # Return as percentage
        return 0.0

# Example usage
if __name__ == "__main__":
    # Load configuration
    with open('config.json', 'r') as f:
        config = json.load(f)
    
    extractor = PDFExtractor(
        mongodb_uri=config['mongodb_uri'],
        database_name=config['database_name']
    )
    
    # Process a file
    result = extractor.process_drive_file('YOUR_GOOGLE_DRIVE_FILE_ID')
    print(result)
