import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getQuiz: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quiz.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  addQuiz: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        questions: z.number().array(),
        gameModes: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.create({ data: input });

      return quiz;
    }),

  getAllQuizzes: protectedProcedure.query(({ ctx }) => {
    return ctx.db.quiz.findMany();
  }),

  removeQuiz: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.findUnique({
        where: { id: input.id },
      });

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      await ctx.db.quiz.delete({ where: { id: input.id } });

      return quiz;
    }),
});
