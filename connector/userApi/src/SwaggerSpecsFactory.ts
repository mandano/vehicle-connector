import swaggerJsdoc from "swagger-jsdoc";

import { SwaggerConfig } from "./routes/v1/SwaggerConfig.ts";

export default class SwaggerSpecsFactory {
  static create(config: SwaggerConfig): object {
    return swaggerJsdoc(config.options());
  }
}
