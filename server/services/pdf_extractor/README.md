Setup and run instructions for the PDF extractor worker

This folder contains the Python-based PDF extraction worker used as a fallback for OCR and advanced extraction.

## Quick Setup (Automated)

Run the setup script to automatically configure the environment:

```powershell
cd server\services\pdf_extractor
.\setup.ps1
```

This script will:
- Check Python installation
- Create a virtual environment
- Install all required dependencies
- Provide instructions for VS Code configuration

## Manual Setup

### Prerequisites (Windows)
- Python 3.10+ installed and added to PATH. Recommended: install from https://www.python.org/downloads/
- Tesseract OCR installed. Download installer for Windows and install (default path: C:\Program Files\Tesseract-OCR\tesseract.exe)
  - https://github.com/tesseract-ocr/tesseract
  - Ensure the tesseract executable path matches the one configured in `pdf_processor.py` (or update `pytesseract.pytesseract.tesseract_cmd`).
- Poppler utilities (for pdf2image) to convert PDF pages to images (provides `pdftoppm` and `pdftocairo`).
  - Windows builds: https://github.com/oschwartz10612/poppler-windows/releases
  - Add the `bin` folder of Poppler to your PATH.

### Install Python dependencies manually

From the repo root or inside this folder, create a virtual environment and install dependencies:

PowerShell (recommended):
```powershell
cd server\services\pdf_extractor
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If you need to install system packages (Tesseract or Poppler), restart VS Code after installation and select the Python interpreter from the `.venv` created above so Pylance recognizes installed packages.

Configure Google Drive credentials
- Place your service account / OAuth client credentials JSON where you referenced in `config.json` (e.g., `server/google-drive-key.json`) or update `config.json` to point to the correct path.

Running the worker
- From this folder (with the venv activated):
```powershell
# Process a Google Drive file by file id (downloads with credentials in config.json):
python pdf_processor.py --file-id <FILE_ID>

# Or process a local PDF:
python pdf_processor.py --local-path "C:\path\to\file.pdf"
```

The script outputs a JSON object to stdout with `success`, `text`, `metadata`, and `tables` fields.

Troubleshooting Pylance "import could not be resolved" warnings
- Make sure you have activated the correct Python interpreter in VS Code (Command Palette -> Python: Select Interpreter -> choose the `.venv` for this folder).
- After installing packages inside the venv, reload the VS Code window (Developer: Reload Window) and Pylance should pick up installed packages.

If you want, I can add a PowerShell helper (`setup.ps1`) that automates venv creation and pip install for Windows.
