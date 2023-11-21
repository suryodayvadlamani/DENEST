import { RateLimiter } from "limiter";

export const limiter = new RateLimiter({
  tokensPerInterval: 20,
  interval: "min",
  fireImmediately: true,
});
