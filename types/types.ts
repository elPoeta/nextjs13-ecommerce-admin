import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

envVariables.parse(process.env);
declare global {
  namespace NodeJS {
    export interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
