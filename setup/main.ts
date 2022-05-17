import { defineAppSetup } from "@slidev/types";
import PollPlugin from "../src/index";

export default defineAppSetup(({ app }) => {
  app.use(PollPlugin);
});
