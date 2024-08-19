import Home from "@/pages/index";
import { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/counters/:id",
    component: lazy(() => import("@/pages/counters/[id]")),
  },
];

export default routes;
