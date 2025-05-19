import { Router as ExpressRouter } from "express";

export interface RouteInterface {
  init(router: ExpressRouter): void;
}
