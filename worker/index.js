const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

// Actual fibonacci function
function fib(index) {
  if (index == 0) return 0;
  if (index == 1) return 1;

  var prevPrev = 0;
  var prev = 1;
  var result = 0;

  for (let i = 2; i <= index; i++) {
    result = prev + prevPrev;
    prevPrev = prev;
    prev = result;
  }
  return result;
}

// Watch redis for any new value put into it
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

//Subscribe to the insert event
sub.subscribe('insert');