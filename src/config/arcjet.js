import arcjet, { detectBot, slidingWindow } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['ip.src'],
  rules: [
    detectBot({
      mode: 'LIVE',
      allow: [],
    }),
    slidingWindow({
      mode: 'LIVE',
      interval: '10s',
      max: 3,
    }),
  ],
});

export default aj;
