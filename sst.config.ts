/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "semper-finish",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "personal",
          region: "us-east-2",
        },
      },
    };
  },
  async run() {
    const isProd = $app.stage === "prod";

    new sst.aws.SvelteKit("semper-finish", {
      domain: isProd
        ? {
            name: "semperfinishllc.com",
            redirects: ["www.semperfinishllc.com"],
            // Using Route 53 in the same account, so default sst.aws.dns() is fine
          }
        : undefined,
    });
  },
});
