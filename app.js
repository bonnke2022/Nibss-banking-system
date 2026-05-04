require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

//database
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const loginRouter = require("./routes/loginRoute");
const accountRouter = require("./routes/accountRoute");
const transferRouter = require("./routes/transferRoute");
const bvnRouter = require("./routes/bvnRoute");
const ninRouter = require("./routes/ninRoute");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddlewawre = require("./middleware/error-handler");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fintech API",
      version: "1.0.0",
      description: "Nibss Banking System",
    },
    servers: [
      {
        url: "https://nibssbyphoenix.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  }),
);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // ✅ after json parser
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));

// use routes
app.use("/api/fintech/onboard", authRouter);
app.use("/api/auth/token", loginRouter);
app.use("/api/account", accountRouter);
app.use("/api", transferRouter);
app.use("/api", bvnRouter);
app.use("/api", ninRouter);

// use middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddlewawre);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
