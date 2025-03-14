import { Context } from "hono";
import { ZodError } from "zod";

class Response {
  context: Context<any, any, {}>;

  constructor(ctx: Context) {
    this.context = ctx;
  }

  isZodError = (obj: ZodError) => {
    return obj.name === "ZodError" && Array.isArray(obj.issues);
  };

  mapZodError = (error: ZodError) => {
    return error.issues.map((issue) => {
      const field = issue.path.join(".");
      const message = issue.message;
      return {
        field,
        message,
      };
    });
  };

  success = (data: any, statusCode?: any) => {
    return this.context.json(
      {
        success: true,
        data,
      },
      statusCode ?? 200
    );
  };

  error = (error: any, statusCode?: any) => {
    return this.context.json(
      {
        success: false,
        error: this.isZodError(error) ? this.mapZodError(error) : error,
      },
      statusCode ?? 400
    );
  };

  redirect = (url: string, statusCode?: any) => {
    return this.context.redirect(url, statusCode ?? 302);
  };
}
export default Response;
