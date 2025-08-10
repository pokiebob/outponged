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

```bash
git clone https://github.com/yourusername/outponged.git
cd outponged
```

```bash
npm install
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

