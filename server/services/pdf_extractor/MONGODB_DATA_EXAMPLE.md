# What Gets Stored in MongoDB When You Upload a PDF

## Example Document Record After Upload

When faculty uploads a PDF, here's **exactly** what gets stored in MongoDB:

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  
  // User Information
  title: "Data Structures and Algorithms Syllabus",
  description: "Complete syllabus for CS301",
  type: "syllabus",  // or "pyq" or "reference"
  subject: "Computer Science",
  subjectCode: "CS301",
  uploadedBy: ObjectId("507f191e810c19729de860ea"),
  
  // File Information
  fileName: "syllabus-2025.pdf",
  originalName: "CS301-Syllabus.pdf",
  filePath: "/uploads/documents/507f1f77bcf86cd799439011.pdf",
  driveLink: "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing",
  driveFileId: "1a2b3c4d5e6f7g8h9i0j",
  fileSize: 2048576,  // bytes
  mimeType: "application/pdf",
  
  // ⭐ EXTRACTED DATA (This is where all PDF content goes)
  extractedText: `
    UNIT I: Introduction to Data Structures
    Data structures, ADT, Arrays, Linked Lists
    
    UNIT II: Stacks and Queues
    Stack ADT, Operations, Applications
    Queue ADT, Circular Queue, Priority Queue
    
    UNIT III: Trees
    Binary Trees, Binary Search Trees, AVL Trees
    
    UNIT IV: Graphs
    Graph Representation, Traversal Algorithms
    Depth First Search, Breadth First Search
  `,
  
  // ⭐ EXTRACTION METADATA
  metadata: {
    pageCount: 15,
    wordCount: 3247,
    extraction_method: "python-worker",  // or "pdf-parse", "tesseract.js", "ocr"
    extractedAt: 2025-01-15T10:30:00.000Z
  },
  
  // ⭐ EXTRACTED TOPICS (Automatically extracted)
  topics: [
    {
      name: "data structures",
      confidence: 92.5,
      extractedAt: 2025-01-15T10:30:00.000Z
    },
    {
      name: "algorithms",
      confidence: 87.3,
      extractedAt: 2025-01-15T10:30:00.000Z
    },
    {
      name: "linked",
      confidence: 78.1,
      extractedAt: 2025-01-15T10:30:00.000Z
    },
    {
      name: "search",
      confidence: 65.2,
      extractedAt: 2025-01-15T10:30:00.000Z
    },
    // ... more topics (up to 10)
  ],
  
  // Processing Status
  processingStatus: "completed",  // pending → processing → completed
  processingError: null,
  
  // Other
  tags: ["syllabus", "data-structures", "core"],
  isPublic: false,
  createdAt: 2025-01-15T10:28:00.000Z,
  updatedAt: 2025-01-15T10:30:00.000Z
}
```

## Key Fields Explained

### 1. `extractedText` (String)
**What**: All text content from the PDF
**Use**: Search, AI question generation, content analysis
**Example**: Full syllabus text, question papers content, reference material

### 2. `metadata` (Object)
**What**: Information about the extraction process
- `pageCount`: Number of pages (15)
- `wordCount`: Total words extracted (3247)
- `extraction_method`: How text was extracted
  - `pdf-parse`: Direct text extraction (fast, works for text PDFs)
  - `tesseract.js`: OCR for scanned documents
  - `python-worker`: Advanced OCR with preprocessing
- `extractedAt`: Timestamp when extraction completed

### 3. `topics` (Array)
**What**: Key topics automatically extracted from the text
- Each topic has a `name` and `confidence` score
- Top 10 most frequently mentioned topics
- Used for document categorization and recommendations

### 4. `processingStatus` (String)
**What**: Current status of extraction
- `pending`: Uploaded, waiting to process
- `processing`: Extraction in progress
- `completed`: Successfully extracted
- `failed`: Extraction failed (check `processingError`)

## Timeline of What Happens

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Faculty uploads PDF (10:28:00)                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Document record created in MongoDB                        │
│    - All basic fields populated                             │
│    - processingStatus: "pending"                            │
│    - extractedText: "" (empty)                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Background extraction starts (10:28:01)                  │
│    - processingStatus: "processing"                          │
│    - Downloads/file reads PDF                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Extraction methods tried (10:28:02 - 10:30:00)            │
│    ├─→ pdf-parse (fast, text-based PDFs)                    │
│    ├─→ tesseract.js (scanned PDFs)                          │
│    └─→ python-worker (advanced OCR)                         │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Data saved to MongoDB (10:30:00)                         │
│    ✓ extractedText: Full PDF text                          │
│    ✓ metadata: { pageCount, wordCount, extraction_method }  │
│    ✓ topics: Auto-extracted key topics                     │
│    ✓ processingStatus: "completed"                         │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Ready for use!                                           │
│    - Search by content                                      │
│    - Generate questions from text                           │
│    - Recommend based on topics                              │
└─────────────────────────────────────────────────────────────┘
```

## How to Query This Data

### Get all extracted text for a document:
```javascript
const doc = await Document.findById(documentId);
console.log(doc.extractedText);  // All PDF text
```

### Search documents by content:
```javascript
const docs = await Document.find({
  extractedText: { $regex: "data structures", $options: "i" }
});
```

### Get documents by extraction method:
```javascript
const docs = await Document.find({
  "metadata.extraction_method": "python-worker"
});
```

### Get documents with topics:
```javascript
const docs = await Document.find({
  "topics.name": { $in: ["algorithms", "data structures"] }
});
```

### Get processing statistics:
```javascript
const stats = await Document.aggregate([
  {
    $group: {
      _id: "$metadata.extraction_method",
      count: { $sum: 1 }
    }
  }
]);
```

## What Happens After Upload

### ✅ Automatic Process
1. Document uploaded → saved to MongoDB
2. Background extraction starts automatically
3. Text extracted using best available method
4. Topics automatically extracted
5. Metadata calculated (pages, words, method)
6. Everything saved back to MongoDB
7. Status updated to "completed"

### ✅ All Data Available For
- **Question Generation**: Use `extractedText` as context for AI
- **Search**: Search through all uploaded documents
- **Content Analysis**: Topics and metadata for insights
- **Recommendations**: Suggest similar documents based on topics

## Testing the Storage

### Check if extraction worked:
```javascript
const doc = await Document.findById(documentId);
console.log("Status:", doc.processingStatus);
console.log("Text length:", doc.extractedText.length);
console.log("Pages:", doc.metadata.pageCount);
console.log("Method:", doc.metadata.extraction_method);
console.log("Topics:", doc.topics);
```

### Expected output:
```
Status: completed
Text length: 15642
Pages: 15
Method: python-worker
Topics: [{ name: 'data structures', confidence: 92.5 }, ...]
```

## Summary

✅ **What gets stored**: ALL text from PDF + metadata + topics  
✅ **When it happens**: Automatically in background after upload  
✅ **How long it takes**: 2-60 seconds depending on PDF complexity  
✅ **What you can do**: Search, generate questions, analyze content  

**The system is ready to extract and store all PDF data!**

