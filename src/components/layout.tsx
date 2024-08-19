import { A } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import { css } from "../../styled-system/css";
import logo from "@/assets/logo.png";

const AppLayout: ParentComponent<{ title?: string }> = ({
  children,
  title,
}) => {
  return (
    <div>
      <nav class={css({ display: "flex", gap: 4, p: 2, alignItems: "center" })}>
        <A href="/">
          <img src={logo} class={css({ w: 16, h: 16, objectFit: "contain" })} />
        </A>
        <p class={css({ fontSize: 26 })}>{title}</p>
      </nav>
      <div class={css({ p: 10 })}>{children}</div>
    </div>
  );
};

export default AppLayout;
