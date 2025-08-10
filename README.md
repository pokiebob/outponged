# outponged

## to start
- enter outponged directory
- setenv
- npm start

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
- Personalized algorithm for feed
- Approval system
  - Player requests to join club
  - Club owner can change settings, require approval or free entry
- Suggestions forum (add to nav bar)
- Improve convenience
- CSS
  - Change theme: black and red
  - Download icons for each page
- Home Screen
  - Add general social media feed of user posts
