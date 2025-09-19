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
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    const isProd = $app.stage === "prod";
    const bookingApiSecret = new sst.Secret("BookingApiSecret")

    if (isProd && !bookingApiSecret) {
      throw new Error("BOOKING_API_SECRET is required for prod deployments. Set it in your deploy environment.");
    }

    const api = new sst.aws.ApiGatewayV2("BookingApi");
    api.route("POST /booking-request", {
      handler: "functions/booking-request.handler",
      runtime: "nodejs22.x",
      link: [bookingApiSecret],
      permissions: [
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: ["*"]
        }
      ],
      environment: {
        EMAIL_FROM: "booking@semperfinishllc.com",
        EMAIL_TO: "ryantoken13@gmail.com,semperfinishllc@gmail.com",
      },
    });

    new sst.aws.SvelteKit("semper-finish", {
      link: [bookingApiSecret],
      environment: {
        BOOKING_API_URL: api.url
      },
      domain: isProd
        ? {
            name: "semperfinishllc.com",
            redirects: ["www.semperfinishllc.com"],
          }
        : undefined,
    });
  },
  
  console: {
    autodeploy: {
      // keep your target() that returns "prod", or the unconditional one you added
      target(event) {
        if (event.type === "branch" && event.branch === "main" && event.action === "pushed") {
          return { stage: "prod" };
        }
      },
  
      async workflow({ $, event }) {
        // Install Volta and use Node 22.12
        await $`curl -fsSL https://get.volta.sh | bash -s -- --skip-setup`;
        $.env("VOLTA_HOME", "/root/.volta");
        $.env("PATH", `/root/.volta/bin:${$.env("PATH")}`);
        await $`volta install node@22.12.0`;
  
        // Optional: verify the version in the logs
        await $`node -v`;
  
        // Install deps and deploy
        await $`bun i`;
        if (event.action === "removed") {
          await $`bun sst remove`;
        } else {
          await $`bun sst deploy`;
        }
      }
    }
  }
});
