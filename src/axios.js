import axios from 'axios';

// Public list endpoints must not receive a placeholder Authorization header.
// The API treats any supplied bearer token as real authentication material and
// correctly rejects malformed values, which previously broke Players and Clubs.
export default axios.create();
