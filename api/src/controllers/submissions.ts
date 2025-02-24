import db from "@/db";
import { secureDelete, secureFind, secureFindMany } from "@/db/crud";
import Response from "@/utils/response";
import { getUser } from "@/utils/user";
import { Hono } from "hono";

const submissions = new Hono<{ Bindings: Env }>();

export const SubmissionsController = submissions
  .get("/:id", async (ctx) => {
    const { id } = ctx.req.param();
    const user = getUser(ctx);

    const submission = await secureFind(db(ctx.env), "submission", user.id, id, {
      include: {
        logs: true,
      },
    });

    if (!submission) {
      return new Response(ctx).error("Submission not found", 404);
    }

    return new Response(ctx).success({ submission });
  })
  .get("/:id/all", async (ctx) => {
    const { id } = ctx.req.param();
    const user = getUser(ctx);

    const submissions = await secureFindMany(db(ctx.env), "submission", user.id, {
      where: { formId: id },
      include: {
        logs: true,
      },
    });

    if (!submissions) {
      return new Response(ctx).error("Submissions not found", 404);
    }

    return new Response(ctx).success({ submissions });
  })
  .delete("/:id", async (ctx) => {
    const { id } = ctx.req.param();
    const user = getUser(ctx);

    await secureDelete(db(ctx.env), "submission", user.id, id);

    return new Response(ctx).success({ message: "Submission deleted" });
  });
