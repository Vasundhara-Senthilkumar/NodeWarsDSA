const fs = require('fs');
const { dbPath } = require('./index');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted', dbPath);
}

// Recreate schema via requiring db, then seed
require('./index');
require('./seed').seed();
console.log('Database reset + reseeded.');
