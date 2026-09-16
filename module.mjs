// @ts-check
import { module } from "@prisma/composer";
import apiService from "./apps/api/service.mjs";
import webService from "./apps/web/service.mjs";

export default module("sahl2", ({ provision }) => {
  provision(apiService);
  provision(webService);
});
