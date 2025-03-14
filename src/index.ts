import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import { config } from "dotenv";
import express from "express";
import path from "path";

import authRoute from "./routes/authRoute";
import featuredProductRouter from "./routes/featuredProductRoute";
import productRouter from "./routes/productRoute";
import saleRouter from "./routes/saleRoute";
import userRouter from "./routes/userRoute";
import connectDB from "./utils/connecDb";

const app = express(); //incialização do express
config();

const corsOptions: CorsOptions = {
  // origin: function (
  //   origin: string | undefined,
  //   callback: (err: Error | null, allow?: boolean) => void
  // ) {
  //   if (
  //     origin &&
  //     origin.startsWith(
  //       "https://65e161da812d20000878ea96--profound-kataifi-86bea6.netlify.app/"
  //     )
  //   ) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  origin: true,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,X-Requested-With,Authorization",
};

app.use(cors(corsOptions)); //configuração do cors
app.use(express.json()); //configuração de json
app.use(cookieParser()); //configuração de cookies

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/featuredProducts", featuredProductRouter);
app.use("/api/images", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/sale", saleRouter);

//erro para rotas inexistentes
app.all(
  "*",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log();
    const err = new Error("Route not found") as any;
    err.statusCode = 404;
    next(err);
  }
);

//teste de rotas
app.get(
  "/test",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(200).json({
      status: true,
      message: "Bem vindo ao afiliados 800k",
    });
  }
);

//preparação de erro global
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    err.status = err.status || false;
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
);

const port = /*config.get<number>("port") ||*/ 5000;

app.listen(port, async () => {
  console.log("Server listening on port " + port);
  await connectDB();
});
