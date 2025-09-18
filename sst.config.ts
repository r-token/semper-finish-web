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

    const api = new sst.aws.ApiGatewayV2("BookingApi");
    api.route("POST /booking-request", {
      handler: "functions/booking-request.handler",
      permissions: [
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: ["*"]
        }
      ],
      environment: {
        EMAIL_FROM: "booking@semperfinishllc.com",
        EMAIL_TO: "ryantoken13@gmail.com",
      },
    });

    new sst.aws.SvelteKit("semper-finish", {
      environment: {
        BOOKING_API_URL: api.url,
      },
      domain: isProd
        ? {
            name: "semperfinishllc.com",
            redirects: ["www.semperfinishllc.com"],
          }
        : undefined,
    });
  },
});
