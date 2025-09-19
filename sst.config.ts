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
      }
    }
  }
});