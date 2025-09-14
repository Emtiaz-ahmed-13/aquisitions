import aj from '#config/arcjet.js';
import logger from '#config/logger.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const userAgent = req.get('User-Agent');
    logger.debug('Request User-Agent:', userAgent);

    // Simple protection for testing - remove complex role-based logic for now
    const decision = await aj.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent,
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
        reason: 'bot_detection',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Blocked request', {
        ip: req.ip,
        userAgent,
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security policy',
        reason: 'shield_protection',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent,
        path: req.path,
      });

      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Try again later.',
        reason: 'rate_limit',
      });
    }

    next();
  } catch (e) {
    console.error('Arcjet middleware error:', e);
    // Continue with the request even if Arcjet fails
    next();
  }
};

export default securityMiddleware;
