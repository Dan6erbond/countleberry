import "./index.css";

import { Router } from "@solidjs/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
/* @refresh reload */
import { render } from "solid-js/web";
import routes from "./routes";

dayjs.extend(relativeTime);

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <Router>{routes}</Router>, root!);
