/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "semper-finish",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "personal"
        }
      },
    };
  },
  async run() {
    new sst.aws.SvelteKit("semper-finish");
  },
});
