# VS Code Python Interpreter Setup

## Fix Import Errors in VS Code

The import errors appear because VS Code doesn't know which Python interpreter to use. Follow these steps:

### Step 1: Open Command Palette
- Press `Ctrl + Shift + P`

### Step 2: Select Python Interpreter
- Type: `Python: Select Interpreter`
- Press Enter

### Step 3: Choose the Correct Interpreter
Select one of these:
1. `.\venv\Scripts\python.exe` (if it appears in the list)
2. OR manually browse and select: `C:\Users\Kunal\Desktop\College-Project-V2\server\services\pdf_extractor\.venv\Scripts\python.exe`

### Step 4: Reload VS Code Window
- Press `Ctrl + Shift + P` again
- Type: `Developer: Reload Window`
- Press Enter

### Step 5: Verify
The import errors should disappear! ✅

## Alternative: Set in Settings.json

If the above doesn't work, add this to your VS Code workspace settings:

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/server/services/pdf_extractor/.venv/Scripts/python.exe"
}
```

## Quick Fix One-Liner (PowerShell)

```powershell
code --settings "python.defaultInterpreterPath=./server/services/pdf_extractor/.venv/Scripts/python.exe"
```

## Verification

To verify the interpreter is correct:
1. Open `pdf_processor.py`
2. Look at bottom-right corner of VS Code
3. You should see the Python version (e.g., Python 3.13.5)
4. Click it and verify it's using `.venv` interpreter

## If Import Errors Still Appear

If errors persist after setting the interpreter:

1. Close VS Code completely
2. Delete `.vscode` folder from project root (if it exists)
3. Reopen VS Code
4. Select Python interpreter again
5. Reload window

## Why This Happens

VS Code (Pylance) needs to know which Python environment to use. The `.venv` folder has all your packages installed, but VS Code doesn't automatically use it - you need to tell it which interpreter to use.

