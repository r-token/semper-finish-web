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
        // 1) Install Node 22 and put it first on PATH for the entire job
        const NODE_VERSION = "v22.12.0";
        const TGZ = `https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz`;
      
        await $`curl -fsSL ${TGZ} -o /tmp/node.tar.xz`;
        await $`mkdir -p /opt/node-${NODE_VERSION}`;
        await $`tar -xJf /tmp/node.tar.xz -C /opt/node-${NODE_VERSION} --strip-components=1`;
      
        // Make Node 22 first on PATH for all subsequent steps (including nested builders)
        $.env("PATH", `/opt/node-${NODE_VERSION}/bin:${$.env("PATH")}`);
      
        // Optional sanity checks
        await $`node -v`;
        await $`npm -v`;
      
        // 2) Install deps and deploy with Bun
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
