import NodeCache from "node-cache";

// Create cache instance with 5 min default TTL
export const cache = new NodeCache({
  stdTTL: 300, // 5 minutes in seconds
  checkperiod: 320, // Check for expired keys every 320 seconds
  useClones: false, // For better performance
});

export const cacheMiddleware =
  (keyPrefix, ttl = 300) =>
  async (req, res, next) => {
    // Create a unique cache key based on the route and query parameters
    const cacheKey = `${keyPrefix}_${req.originalUrl}_${JSON.stringify(
      req.query
    )}`;

    try {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.json(cachedData);
      }

      // Store the original json method
      const originalJson = res.json;

      // Override res.json method to cache the response
      res.json = function (data) {
        // Cache the response data
        cache.set(cacheKey, data, ttl);
        console.log(`Cache set for key: ${cacheKey}`);

        // Call the original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error("Cache error:", error);
      next();
    }
  };

export const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = pattern
    ? keys.filter((key) => key.includes(pattern))
    : keys;

  matchingKeys.forEach((key) => cache.del(key));
  console.log(`Cleared ${matchingKeys.length} cache entries`);
};
