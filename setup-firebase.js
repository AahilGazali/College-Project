#!/usr/bin/env node

/**
 * Firebase Setup Helper Script
 * This script helps you create a .env file with your Firebase configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Helper 🔥\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            createEnvFile();
        } else {
            console.log('Setup cancelled. Your existing .env file remains unchanged.');
        }
        rl.close();
    });
} else {
    createEnvFile();
}

function createEnvFile() {
    console.log('\n📝 Creating .env file...\n');
    
    const envContent = `# Firebase Configuration
# Fill in your Firebase project details below
# Get these values from: https://console.firebase.google.com/

REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Note: All environment variables must start with REACT_APP_ to be accessible in React
# After filling in these values, restart your development server with: npm start
`;

    try {
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Open the .env file in your project root');
        console.log('2. Replace the placeholder values with your Firebase configuration');
        console.log('3. Save the file');
        console.log('4. Restart your development server: npm start');
        console.log('\n📖 For detailed setup instructions, see FIREBASE_SETUP.md');
    } catch (error) {
        console.error('❌ Error creating .env file:', error.message);
        console.log('\n💡 You can manually create a .env file in your project root with the content above.');
    }
}
