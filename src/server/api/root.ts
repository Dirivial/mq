import { createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "~/server/api/routers/category";
import { questionRouter } from "~/server/api/routers/question";
import { exampleRouter } from "~/server/api/routers/example";
import { quizRouter } from "./routers/quiz";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  question: questionRouter,
  quiz: quizRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
