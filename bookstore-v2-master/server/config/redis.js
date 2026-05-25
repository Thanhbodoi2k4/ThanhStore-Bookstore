const mockRedisClient = {
    get: async () => null,
    setex: async () => {},
    keys: async () => [],
    del: async () => {},
};

module.exports = mockRedisClient