import {Redis} from "ioredis";

// const redis=new Redis({
//     host:"localhost",
//     port:6379,
//     maxRetriesPerRequest:null,
//     lazyConnect:true,
//     retryStrategy:(times)=>Math.min(times*50,2000)
// });
const redis = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    retryStrategy: (times) => Math.min(times * 50, 2000),
});
export default redis