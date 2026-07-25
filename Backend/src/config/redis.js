import { Redis } from "ioredis";
import logger from "./logger.js";

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => logger.info("Redis Connected"));
redis.on("error", (err) => logger.error("Redis error", { error: err.message }));

export default redis;
