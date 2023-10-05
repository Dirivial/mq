import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
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
