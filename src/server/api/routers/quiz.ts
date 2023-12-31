import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const quizRouter = createTRPCRouter({
  getQuiz: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quiz.findUnique({
        where: {
          id: input.id,
        },
        include: {
          questions: true,
        },
      });
    }),

  addQuiz: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        questions: z.number().array(),
        questionOrder: z.number().array(),
        gameModes: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.create({
        data: {
          name: input.name,
          description: input.description,
          questions: {
            connect: input.questions.map((question) => ({ id: question })),
          },
          questionsOrder: input.questionOrder,
          gameModes: input.gameModes,
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return quiz;
    }),

  getQuizzesByUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.quiz.findMany({
        where: {
          creatorId: input.id,
        },
      });
    }),

  getQuizzesByMe: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.quiz.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
    });
  }),

  updateQuiz: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        questions: z.number().array(),
        questionOrder: z.number().array(),
        gameModes: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.db.quiz.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          questions: {
            connect: input.questions.map((question) => ({ id: question })),
          },
          gameModes: input.gameModes,
        },
      });

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
