import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  getSomeQuestions: protectedProcedure.query(async ({ ctx }) => {
    const productsCount = await ctx.db.question.count();
    let skip = Math.floor(Math.random() * productsCount);
    if (skip > productsCount - 5) skip = productsCount - 5;
    return await ctx.db.question.findMany({
      take: 5,
      skip: skip,
      orderBy: {
        lastPicked: "desc",
      },
    });
  }),

  getGroupOfQuestions: protectedProcedure
    .input(z.object({ ids: z.number().array() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.question.findMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),

  getAllQuestions: protectedProcedure.query(({ ctx }) => {
    return ctx.db.question.findMany();
  }),

  createQuestion: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        questionType: z.string(),
        content: z.string(),
        answer: z.string(),
        categories: z.number().array(),
        start: z.number(),
        end: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.db.question.create({
        data: {
          text: input.text,
          type: input.questionType,
          answer: input.answer,
          startTime: input.start,
          endTime: input.end,
          content: input.content,
          lastPicked: new Date(),
          categories: {
            connect: input.categories.map((category) => ({ id: category })),
          },
        },
      });
      return question;
    }),

  updateQuestion: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        text: z.string(),
        questionType: z.string(),
        content: z.string(),
        answer: z.string(),
        categories: z.number().array(),
        start: z.number(),
        end: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.update({
        where: { id: input.id },
        data: {
          text: input.text,
          type: input.questionType,
          answer: input.answer,
          startTime: input.start,
          endTime: input.end,
          content: input.content,
          categories: {
            connect: input.categories.map((category) => ({ id: category })),
          },
        },
      });
    }),

  removeQuestion: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
      });

      if (!category) {
        throw new Error("Question not found");
      }

      await ctx.db.question.delete({ where: { id: input.id } });

      return category;
    }),
});
