import { Application, RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { LoggerInterface } from "../../common/src/logger/LoggerInterface.ts";

import { SwaggerConfig } from "./routes/v1/SwaggerConfig.ts";
import { Router } from "./routes/v1/Router.ts";

export class HttpExpressServer {
  private readonly _port: number;
  private _expressApp: Application;
  private readonly _swaggerSpecs: object;
  private readonly _jsonBodyParser: RequestHandler;
  private readonly _router: Router;
  private readonly _logger: LoggerInterface;

  constructor(
    port: number,
    expressApp: Application,
    swagger: SwaggerConfig,
    jsonBodyParser: RequestHandler,
    router: Router,
    logger: LoggerInterface,
  ) {
    this._port = port;
    this._expressApp = expressApp;
    this._swaggerSpecs = swaggerJsdoc(swagger.options());
    this._jsonBodyParser = jsonBodyParser;
    this._router = router;
    this._logger = logger;
  }

  public init() {
    this._expressApp.disable("x-powered-by");
    this._expressApp.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(this._swaggerSpecs),
    );

    this._expressApp.use(this._jsonBodyParser);

    this._router.init();
    this._expressApp.use("/api/v1", this._router.router);
  }

  public listen() {
    this._expressApp.listen(this._port, () => {
      this._logger.log(`HttpServer is running on port ${this._port}`);
    });
  }
}
