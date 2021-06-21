# outponged

## ARCHITECTURE

  Outponged UI (React)     ->  Outponged Service (NodeJS)    ->  MONGODB
          |
          |------pics-------> AWS S3

## AWS (amplify)
application: outponged
site: https://www.outponged.com/

- install cli: 
  - npm install -g @aws-amplify/cli
  - amplify init


## To-Do
- Approval system
  - Player requests to join club
  - Club owner can change settings, require approval or free entry
- Suggestions forum (add to nav bar)
- Improve convenience
  - Logo sends to home
- CSS
  - Change theme: black and red
  - Download icons for each page
- Home Screen
  - Add general social media feed of user posts
- Profile Pages
  - Post videos and images
  - Edit Profile Button
- Edit Profile
  - Fix margins on mobile
  - User can only edit their own profile
- Home Page
  - Posts feed
