import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
  console.log('Redis client connected');
}).on('error', err => {
  console.log('Redis client error', err);
});

client.connect();
// await client.connect();
export default client;


// await client.disconnect();