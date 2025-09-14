import http from 'http';

// Make 10 rapid requests to test rate limiting
for (let i = 1; i <= 10; i++) {
  setTimeout(() => {
    http
      .get('http://localhost:3000/health', res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          console.log(`Request ${i}: Status ${res.statusCode}`);
          console.log(`Response: ${data}`);
          console.log('---');
        });
      })
      .on('error', err => {
        console.log(`Request ${i}: Error: ${err.message}`);
      });
  }, i * 100); // 100ms delay between requests
}
