# OutPonged

OutPonged is a social networking platform for table tennis players, clubs, coaches, and enthusiasts.  
It connects the global table tennis community through player profiles, club listings, tournaments, and a social media–style feed.

## Features

- **User Authentication**: Google Sign-In via AWS Cognito (Amplify Auth)
- **Profiles**: Create and edit player profiles with photos, rankings, and achievements
- **Clubs**: Browse, join, and manage clubs (club owners can set join approval rules)
- **Tournaments**: View and track upcoming table tennis events
- **Feed**: Post updates, images, and news to the community
- **Search**: Find players and clubs with live search/autocomplete
- **Responsive UI**: Mobile-first Material-UI interface
- **Media Hosting**: Store and retrieve profile and post images via AWS S3

## Architecture

OutPonged UI (React + Material-UI)
        ↓
  OutPonged Service (Node.js/Express API)
        ↓
       MongoDB (Atlas)
        ↓
   AWS S3 (media storage)

- **Frontend**: React (Material-UI components, AWS Amplify for auth/storage)
- **Backend**: Node.js + Express API (REST endpoints for players, clubs, posts)
- **Database**: MongoDB Atlas for persistent storage
- **Media**: AWS S3 buckets for user-uploaded images
- **Auth**: AWS Cognito for secure login with Google OAuth

## Prerequisites

- **Node.js** >= 14.x
- **npm** >= 6.x
- AWS Account with Amplify, S3, and Cognito configured
- MongoDB Atlas account and connection string

## Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/outponged.git
cd outponged
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=https://your-backend-url/api
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=your_cognito_user_pool_id
REACT_APP_CLIENT_ID=your_cognito_app_client_id
REACT_APP_S3_BUCKET=your_bucket_name
```

If using the legacy `setenv` script:
```bash
source setenv
```

### 4. Start Development Server
```bash
npm start
```
This will launch the app on http://localhost:3000.

## AWS Amplify Hosting

### Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

### Initialize Amplify
```bash
amplify init
```

### Deploy
```bash
amplify publish
```

Live site: https://www.outponged.com

## To-Do / Roadmap

- **Personalized Feed Algorithm**  
  Use engagement and player connections to rank posts.
  
- **Club Approval System**  
  - Players request to join a club  
  - Club owner can approve or reject requests  
  - Option for open or restricted entry

- **Suggestions Forum**  
  Add a feedback section to the navigation bar.

- **UI/UX Enhancements**  
  - Dark theme with black and red accents  
  - Custom icons for each page  
  - Improved mobile responsiveness

- **Home Screen Improvements**  
  - Add a general community feed displaying public posts from all users.

## Project Structure

```
src/
  components/        # Reusable UI components
  pages/             # Page-level components (Home, Players, Clubs, etc.)
  api-url.js         # API endpoint definitions
  Context.js         # React Context for global state
  app-config.js      # App constants
  App.js             # Root component
```

