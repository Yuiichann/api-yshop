import RateLimit from 'express-rate-limit';

const limiterLogin = RateLimit({
  windowMs: 5 * 60 * 1000, // 5m,
  max: 5,
  message: {
    status: 429,
    msg: 'To many requests from this IP, please try again after 5 minutes!',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiterLogin;
