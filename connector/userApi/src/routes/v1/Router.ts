import { Router as ExpressRouter } from "express";

import { RouteInterface } from "../RouteInterface.ts";

export class Router {
  private readonly _router: ExpressRouter;
  private _routes: RouteInterface[] = [];

  constructor(router: ExpressRouter, routes: RouteInterface[]) {
    this._router = router;
    this._routes = routes;
  }

  public init() {
    this._routes.forEach((route) => {
      route.init(this._router);
    });
  }

  get router(): ExpressRouter {
    return this._router;
  }
}
