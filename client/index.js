const concurrently = require('concurrently');
const path = require('path');

// Run client and server concurrently
concurrently([
  {
    command: 'npm run dev',
    name: 'server',
    cwd: path.resolve(__dirname, 'server'),
    prefixColor: 'blue'
  },
  {
    command: 'npm start',
    name: 'client',
    cwd: path.resolve(__dirname, 'client'),
    prefixColor: 'green'
  }
]); 