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
    const testimonialApiSecret = new sst.Secret("TestimonialApiSecret");
    const slackBotToken = new sst.Secret("SlackBotToken");

    const api = new sst.aws.ApiGatewayV2("BookingApi");
    
    api.route("POST /booking-request", {
      handler: "src/lib/server/booking-request.handler",
      runtime: "nodejs22.x",
      link: [bookingApiSecret, slackBotToken],
      permissions: [
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: ["*"]
        }
      ],
      environment: {
        EMAIL_FROM: "booking@semperfinishllc.com",
        EMAIL_TO: isProd
          ? "ryantoken13@gmail.com,semperfinishllc@gmail.com"
          : "ryantoken13@gmail.com",
        SLACK_BOOKING_REQUESTS_CHANNEL_ID: isProd
          ? "C09HDCZU6TB" // booking-requests
          : "C09GZLKFE14", // booking-requests-dev
      },
    });
    
    api.route("POST /testimonial", {
      handler: "src/lib/server/testimonial.handler",
      runtime: "nodejs22.x",
      link: [testimonialApiSecret, slackBotToken],
      permissions: [
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: ["*"]
        }
      ],
      environment: {
        EMAIL_FROM: "web@semperfinishllc.com",
        EMAIL_TO: isProd
          ? "ryantoken13@gmail.com,semperfinishllc@gmail.com"
          : "ryantoken13@gmail.com",
        SLACK_TESTIMONIALS_CHANNEL_ID: isProd
          ? "C0A02Q1JUHW" // testimonials
          : "C09ULDCGES2", // testimonials-dev
      },
    });

    new sst.aws.SvelteKit("semper-finish", {
      link: [bookingApiSecret, testimonialApiSecret],
      environment: {
        API_URL: api.url
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
          return { stage: "prod" }; // deploy main to prod
        }
      }
    }
  }
});
