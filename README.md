# PrivacyPolicyExtension
A Chrome Extension for summarizing and scoring privacy policies

# To CS1050 Teaching Staff
Hello CS1050 teaching staff! Running our project requires an OpenAI and Firebase API keys. If you would like to run the code locally, please reach out and we'd be happy to provide the necessary API keys to run the code!

# Running Locally

To run the extension locally, follow the steps below:

1. Open the project and `cd` into the `simplify-privacy` directory of the project.
2. Run `npm install`.
3. Add a file titled `env.json` to the `simplify-privacy/src` directory. In the file, create a JSON object with the following structure:
   ```json
   {
     "OPENAI_API_KEY": "{INSERT OPENAI API KEY HERE}"
   }
   ```


4. Add a file titled `firebase.config.js` to the simplify-privacy/src directory. In the file, copy and paste the following code. Make sure to replace the placeholder with a Firebase API key:
   ```javascript
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "{INSERT FIREBASE API KEY HERE}",
      authDomain: "privacypolicyextension.firebaseapp.com",
      projectId: "privacypolicyextension",
      storageBucket: "privacypolicyextension.firebasestorage.app",
      messagingSenderId: "815936074791",
      appId: "1:815936074791:web:69314f901d2be144950a02"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    
    // Initialize Cloud Firestore and get a reference to the service
    export const db = getFirestore(app);
   ```

5. Run `npm run build`.
6. Load the unpacked extension to Chrome using the instructions found here: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked





