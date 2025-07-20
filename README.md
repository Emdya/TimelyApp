
# Timely App

Timely is a cross-platform calendar and task management app designed to help users organize tasks, manage schedules, and stay on top of deadlines. Built with React Native, Expo, and Firebase.



## Installation

Follow the steps below to clone, install, and run the project on your device using Expo.
### Prerequisites 
Before you begin make sure you have the following installed:
- Node.js | https://nodejs.org/ (v18+ recommended)
- Git | https://git-scm.com/
- Expo CLI | Run `npm install -g expo-cli` 
- Firebase CLI _(optional)_ | `npm install -g firebase-tools`  
- Expo Go App (mobile) | Download on [iOS](https://apps.apple.com/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) |

### Clone the Repository
```bash
git clone https://github.com/your-username/TimelyApp.git
cd TimelyApp
```
### Install Dependencies
```bash
npm install
```
### Firebase Setup (One Time)
We'll add the Firebase config to /src/firebase/firebaseConfig.js
1. Go to https://console.firebase.google.com
2. Create a new project named Timely
3. Click “Add App” → Choose “Web App”
4. Copy the Firebase config values and paste them into:
```bash
// src/firebase/firebaseConfig.js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_APP.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
5. Run the app
```bash
npx expo start
```
- Use the QR code to open the app on your phone via Expo Go
- Or press i to open iOS simulator (Mac only), a for Android emulator
### How to Contribute
1. Fork the Repository
2. Create a new branch
```bash
git checkout -b feature/task-filtering
```
3.Make your changes and commit
```bash
git commit -m "Added filtering logic for high-priority tasks"
```
4. Push to your Fork
```bash
git push origin feature/task-filtering
```
### Draft of Project Structure
```bash
TimelyApp/
├── assets/                   # Icons, images
├── src/
│   ├── components/           # TaskCard, CalendarUI, etc.
│   ├── firebase/             # Firebase config
│   ├── screens/              # Home, AddTask, Calendar, etc.
│   ├── utils/                # Helpers and formatters
│   └── App.tsx               # Root app logic
├── app.json                  # Expo config
├── package.json              # Dependencies
└── README.md
```



## Tech Stack

### **Client:**
- **React Native** – Cross-platform mobile framework for iOS/Android
- **Expo** – Rapid development framework for building React Native apps
- **React Navigation** – Routing and navigation between screens
- **React Native Calendars** – Calendar UI components
- **Firebase Authentication SDK** – For user login and registration
- **Expo Notifications** – Push notification integration
- **Zustand / Redux Toolkit** *(optional)* – State management

### **Server & Database (Backend-as-a-Service):**
- **Firebase Firestore** – Real-time NoSQL database for storing tasks, events, and calendar data
- **Firebase Cloud Functions** – Optional serverless backend logic (e.g. scheduled reminders)
- **Firebase Cloud Messaging (FCM)** – For cross-platform push notifications
- **Firebase Storage** *(optional)* – Store profile images or file attachments


## Authors

- [@Emdya](https://github.com/Emdya)


