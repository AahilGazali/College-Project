# PDF Extractor Setup Script for Windows
# This script sets up the Python environment for the PDF extractor worker

Write-Host "=== PDF Extractor Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.10+ from https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Navigate to the pdf_extractor directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path ".venv") {
    Write-Host "Virtual environment already exists. Removing old one..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".venv"
}

python -m venv .venv

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Virtual environment created" -ForegroundColor Green

# Activate virtual environment and upgrade pip
Write-Host "Activating virtual environment and upgrading pip..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to upgrade pip" -ForegroundColor Red
    exit 1
}

# Install requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
python -m pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Please check if all the following are installed:" -ForegroundColor Yellow
    Write-Host "  - Python 3.10+"
    Write-Host "  - Tesseract OCR (for OCR support)"
    Write-Host "  - Poppler utilities (for pdf2image)"
    Write-Host ""
    Write-Host "For more information, see README.md" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. In VS Code, select the Python interpreter from this virtual environment:" -ForegroundColor Yellow
Write-Host "   Command Palette (Ctrl+Shift+P) -> Python: Select Interpreter" -ForegroundColor Yellow
Write-Host "   -> Choose: $scriptDir\.venv\Scripts\python.exe" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Reload VS Code window:" -ForegroundColor Yellow
Write-Host "   Command Palette -> Developer: Reload Window" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Pylance should now recognize all installed packages" -ForegroundColor Green
Write-Host ""
Write-Host "To deactivate the virtual environment, run:" -ForegroundColor Gray
Write-Host "  deactivate" -ForegroundColor Gray
Write-Host ""

# Keep terminal open
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

