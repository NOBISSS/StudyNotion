import { jest } from "@jest/globals";
export const emailQueue = {
  add: jest.fn().mockResolvedValue(true as never),
};
