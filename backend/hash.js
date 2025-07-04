// hash.js
const bcrypt = require('bcrypt');

const password = 'Red@rat'; // Your desired password
const saltRounds = 12;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log("🔐 Hashed password:\n", hash);
});
