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
    const bookingApiSecret = new sst.Secret("BookingApiSecret");

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
      target(event) {
        if (event.type === "branch" && event.branch === "main" && event.action === "pushed") {
          return { stage: "prod" };
        }
      },
  
      async workflow({ $, event }) {
        // Install Node 22
        const NODE_VERSION = "v22.12.0";
        const TGZ = `https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz`;
      
        await $`curl -fsSL ${TGZ} -o /tmp/node.tar.xz`;
        await $`mkdir -p /opt/node-${NODE_VERSION}`;
        await $`tar -xJf /tmp/node.tar.xz -C /opt/node-${NODE_VERSION} --strip-components=1`;
      
        // Update PATH and create symlinks to ensure node/npm are available
        const nodePath = `/opt/node-${NODE_VERSION}/bin`;
        $.env("PATH", `${nodePath}:${$.env("PATH")}`);
        
        // Create symlinks in /usr/local/bin to ensure node is found
        await $`sudo ln -sf ${nodePath}/node /usr/local/bin/node`;
        await $`sudo ln -sf ${nodePath}/npm /usr/local/bin/npm`;
      
        // Verify installation
        await $`node -v`;
        await $`npm -v`;
      
        // Install dependencies and deploy
        await $`npm install`;
        if (event.action === "removed") {
          await $`npx sst remove`;
        } else {
          await $`npx sst deploy`;
        }
      }
    }
  }
});