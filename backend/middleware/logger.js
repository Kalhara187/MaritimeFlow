/**
 * Request logging middleware
 */

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log when response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      user: req.user ? req.user.id : 'anonymous',
    };
    console.log('[REQUEST]', JSON.stringify(log));
  });

  next();
};

module.exports = requestLogger;
