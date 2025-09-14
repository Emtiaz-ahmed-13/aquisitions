import http from 'http';

// Test bot detection with a clearly malicious bot user agent
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
  },
};

// Make 3 requests with bot user agent
for (let i = 1; i <= 3; i++) {
  setTimeout(() => {
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        console.log(`Bot Request ${i}: Status ${res.statusCode}`);
        console.log(`Response: ${data}`);
        console.log('---');
      });
    });

    req.on('error', err => {
      console.log(`Bot Request ${i}: Error: ${err.message}`);
    });

    req.end();
  }, i * 500); // 500ms delay between requests
}
