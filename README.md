# Shopbite - eCommerce Marketplace for Indonesian market

- Available at: https://shopbite-ecommerce-marketplace.vercel.app/

- Demo store: https://shopbite-ecommerce-marketplace.vercel.app/demo

- A collection of screenshots to offer a visual glimpse of some of the app's features: https://github.com/aleor/shopbite-ecommerce-marketplace/screenshots

## Overview

This eCommerce marketplace app has been developed for the Indonesian market, offering a robust set of features tailored to meet the specific needs of local businesses and shoppers.

Key features:

- <strong>Store Creation</strong>: Easy set up and customization of the online store, including defining catalog groups ('collections') and items. Granular control with item variants, add-ons, and other per-item customizations.
- <strong>Free & Paid tiers</strong>: different subscription options, including both subscription-based and one-time payments through Xendit. The paid tier unlocks limitless categories, items, and advanced analytics.
- <strong>Analytics</strong>: Google Analytics integrated into the platform. Possibility to track various user events and access graphical representations within the Admin section for data-driven insights.
- <strong>Responsive Design</strong>: adapts gracefully to different screen sizes, ensuring a consistent user experience, with some features being specifically optimized for smaller screens.

## Disclosures

- My role: sole developer.
- This open-source release has been made possible with the Owner's permission (the Client who initiated and funded the platform development).
- All design assets have been exclusively provided by the Client (through Figma), retaining full intellectual property rights.
- While this version is fully functional, please note that certain limitations exist (e.g., real payments through Xendit are not supported).
- Certain features may appear less polished or optimized. This is a deliberate trade-off to prioritize the app's Time-To-Market and its minimum viable product (MVP) nature.

## Technologies

React, Next.js, TypeScript, Chakra UI, Firebase (Functions, Storage, Firestore), Google Analytics, Chart.js, Xendit (Southeast Asian fintech company, payment provider).

## Installation

App is running on https://shopbite-ecommerce-marketplace.vercel.app/.

To run this application locally, follow these steps:

1. **Clone the repository to your local machine:**

   ```bash
   git clone https://github.com/aleor/shopbite-ecommerce-marketplace.git

2. **Navigate to the project directory:**

   ```bash
   cd shopbite-ecommerce-marketplace

3. **Install the project dependencies:**

   ```bash
   npm install

4. **Set up Firebase for local development:**

   - If you haven't already, create a Firebase project on the Firebase Console.
   
   - Obtain your Firebase project configuration, including the Firebase SDK configuration object, which includes your Firebase API keys, in the Firebase Console.
   
   - Create a .env.local file in the project root directory and add your Firebase configuration as environment variables. Example .env.local:
   
    ```bash
    REACT_APP_API_KEY=your-api-key
    REACT_APP_AUTH_DOMAIN=your-auth-domain
    REACT_APP_PROJECT_ID=your-project-id
    REACT_APP_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_MESSAGING_SENDER_ID=your-sender-id
    REACT_APP_APP_ID=your-app-id
    REACT_APP_MEASUREMENT_ID=your-measurement-id
  
5. **Deploy Firebase Functions:**

- Make sure you have the Firebase CLI installed. If not, you can install it using:
  
  ```bash
  npm install -g firebase-tools

- Deploy Firebase Functions:

  ```bash
  firebase deploy --only functions

6. **Create Firestore and Storage instances on the Firebase Console.**

7. **Start the local development server:**

   ```bash
   npm run start

Your application should now be running locally, and you can access it in your web browser at http://localhost:3000.

Please note that for security reasons, never commit your .env.local file or sensitive Firebase configuration details to version control.
