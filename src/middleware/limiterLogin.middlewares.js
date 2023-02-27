import RateLimit from 'express-rate-limit';

const limiterLogin = RateLimit({
  windowMs: 5 * 60 * 1000, // 5m,
  max: 10,
  message: {
    status: 429,
    message: 'Sai quá số lần quy định, vui lòng thử lại sau!!!',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiterLogin;
