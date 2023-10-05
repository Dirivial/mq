import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getAllCategories: protectedProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany();
  }),

  createCategory: protectedProcedure
    .input(z.object({ name: z.string(), color: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.create({ data: input });

      return category;
    }),

  removeCategory: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      await ctx.db.category.delete({ where: { id: input.id } });

      return category;
    }),
});
