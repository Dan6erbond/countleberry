import * as StyledSwitch from "./styled/switch";

import { Show, children } from "solid-js";

export interface SwitchProps extends StyledSwitch.RootProps {}

export const Switch = (props: SwitchProps) => {
  const getChildren = children(() => props.children);

  return (
    <StyledSwitch.Root {...props}>
      <StyledSwitch.Control onClick={(e) => e.stopPropagation()}>
        <StyledSwitch.Thumb />
      </StyledSwitch.Control>
      <Show when={getChildren()}>
        <StyledSwitch.Label>{getChildren()}</StyledSwitch.Label>
      </Show>
      <StyledSwitch.HiddenInput />
    </StyledSwitch.Root>
  );
};
