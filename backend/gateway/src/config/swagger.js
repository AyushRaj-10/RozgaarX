import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal API Gateway",
      version: "1.0.0",
      description: "API documentation for Job Portal Microservices",
    },
    servers: [
      {
        url: process.env.GATEWAY_URL || "http://localhost:8084",
      },
    ],

    // 🔐 Global Auth
    security: [
      {
        BearerAuth: [],
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: { type: "string", example: "Something went wrong" },
          },
        },

        AuthRegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "john" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "StrongPass123!" },
          },
        },

        AuthLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "StrongPass123!" },
          },
        },

        TokenResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "jwt.token.here" },
            user: {
              type: "object",
              properties: {
                id: { type: "string", example: "123" },
                email: { type: "string", example: "john@example.com" },
                role: { type: "string", example: "user" },
              },
            },
          },
        },

        Job: {
          type: "object",
          properties: {
            id: { type: "string", example: "job123" },
            title: { type: "string", example: "Backend Developer" },
            company: { type: "string", example: "Google" },
            location: { type: "string", example: "Bangalore" },
          },
        },
      },
    },
  },

  apis: ["./src/docs/*.js"], // 👈 your docs folder
};

export const swaggerSpec = swaggerJSDoc(options);