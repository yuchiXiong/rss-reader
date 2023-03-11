import { createClient } from 'redis';

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected');
}).on('error', err => {
  console.log('Redis client error', err);
});

client.connect();
// await client.connect();
export default client;


// await client.disconnect();