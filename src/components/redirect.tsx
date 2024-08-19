import { Component, onMount } from "solid-js";

import { useNavigate } from "@solidjs/router";

const Redirect: Component<{ path: string }> = ({ path }) => {
  const navigate = useNavigate();

  onMount(() => {
    navigate(path);
  });

  return `Redirecting to ${path}`;
};

export default Redirect;
