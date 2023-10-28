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
