const dns = require('dns');
const fs = require('fs');
dns.lookup('google.com', (err, addresses) => {
    if (err) {
        fs.writeFileSync('out3.txt', JSON.stringify({ error: err.message }));
    } else {
        fs.writeFileSync('out3.txt', JSON.stringify(addresses));
    }
});
