import { Matter, Topic } from '@prisma/client';

export const clockTypes = [
  "pomodoro",
  "default"
] as const;
export type ClockType = (typeof clockTypes)[number];


export type MatterWithTopics = Matter & { topics: Topic[] };