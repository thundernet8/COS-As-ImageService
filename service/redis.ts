import * as Redis from "redis";
import * as bluebird from "bluebird";
import * as env from "../env";

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

const client = Redis.createClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD
});

client.on("error", e => {
    // TODO logger
    if (env.isDev) {
        console.log(e);
    }
});

export default client;
