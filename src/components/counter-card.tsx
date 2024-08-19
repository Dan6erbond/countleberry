import { Component, createSignal } from "solid-js";
import { Flex, Stack } from "../../styled-system/jsx";
import { incrementCounter, removeCounter } from "../stores/counters";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Counter } from "../types/counter";
import { Switch } from "../components/ui/switch";
import { TbTrash } from "solid-icons/tb";
import { css } from "../../styled-system/css";
import dayjs from "dayjs";
import { useNavigate } from "@solidjs/router";

const CounterCard: Component<{ counter: Counter }> = ({ counter }) => {
  const navigate = useNavigate();
  const [showOnlyDay, setShowOnlyDay] = createSignal(false);

  return (
    <Card.Root
      onClick={() => navigate(`/counters/${counter.id}`)}
      class={css({ cursor: "pointer" })}
    >
      <Flex gap={4}>
        <Button
          justifySelf="stretch"
          h="auto"
          w={12}
          onClick={() => removeCounter(counter.id)}
          variant="subtle"
        >
          <TbTrash />
        </Button>
        <Flex justify="space-between" flex={1}>
          <Stack p={4}>
            <Flex gap={4}>
              <Card.Title>{counter.name}</Card.Title>
              <p class={css({ color: "gray.8" })}>
                {dayjs(counter.createdAt).fromNow()}
              </p>
            </Flex>
            <Flex gap={4}>
              <p>
                {
                  (showOnlyDay()
                    ? counter.entries.filter(
                        (e) =>
                          dayjs(e.timestamp).date() === dayjs().date() &&
                          dayjs(e.timestamp).month() === dayjs().month() &&
                          dayjs(e.timestamp).year() === dayjs().year()
                      )
                    : counter.entries
                  ).length
                }
              </p>
              <Switch
                checked={showOnlyDay()}
                onCheckedChange={(e) => setShowOnlyDay(e.checked)}
              >
                {showOnlyDay() ? "Daily" : "Total"}
              </Switch>
            </Flex>
          </Stack>
          <Button
            justifySelf="stretch"
            h="auto"
            w={24}
            onClick={(e) => {
              e.stopPropagation();
              incrementCounter(counter.id);
            }}
          >
            +
          </Button>
        </Flex>
      </Flex>
    </Card.Root>
  );
};

export default CounterCard;
