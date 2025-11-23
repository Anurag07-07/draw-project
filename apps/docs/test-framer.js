const fs = require('fs');
try {
  require('framer-motion');
  fs.writeFileSync('test-result.txt', 'Success: framer-motion found');
} catch (e) {
  fs.writeFileSync('test-result.txt', 'Error: framer-motion not found\n' + e.message);
}
