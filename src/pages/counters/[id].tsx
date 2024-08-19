import { Chart, Colors, Legend, Title, Tooltip } from "chart.js";
import { Component, For, createEffect, createSignal, onMount } from "solid-js";
import { Flex, Stack } from "../../../styled-system/jsx";
import {
  counterStore,
  incrementCounter,
  removeEntry,
} from "../../stores/counters";
import { redirect, useParams } from "@solidjs/router";

import AppLayout from "../../components/layout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { CounterEntry } from "../../types/counter";
import { Line } from "solid-chartjs";
import Redirect from "@/components/redirect";
import { Switch } from "../../components/ui/switch";
import { TbTrash } from "solid-icons/tb";
import { css } from "../../../styled-system/css";
import dayjs from "dayjs";

const Counter: Component = () => {
  const params = useParams();
  const counter = counterStore.find((c) => c.id === params.id);

  if (counter === undefined) {
    return <Redirect path="/" />;
  }

  const [showOnlyToday, setShowOnlyDay] = createSignal(false);

  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const chartData = () => {
    if (showOnlyToday()) {
      const today = dayjs(new Date()).format("DD/MM/YYYY");

      const times = counter!.entries.reduce<Record<string, CounterEntry[]>>(
        (times, entry) => {
          const day = dayjs(entry.timestamp).format("DD/MM/YYYY");

          if (day !== today) {
            return times;
          }

          const time = dayjs(entry.timestamp).format("hh:mm");

          if (time in times) {
            times[time] = [...times[time], entry];
          } else {
            times[time] = [entry];
          }

          return times;
        },
        {}
      );

      return {
        labels: Object.keys(times),
        datasets: [
          {
            label: "Entries",
            data: Object.entries(times).map(([, entries]) => entries.length),
          },
        ],
      };
    }

    const days = counter!.entries.reduce<Record<string, CounterEntry[]>>(
      (days, entry) => {
        const day = dayjs(entry.timestamp).format("DD/MM/YYYY");

        if (day in days) {
          days[day] = [...days[day], entry];
        } else {
          days[day] = [entry];
        }

        return days;
      },
      {}
    );
    return {
      labels: Object.keys(days),
      datasets: [
        {
          label: "Entries",
          data: Object.entries(days).map(([, entries]) => entries.length),
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <AppLayout title={counter!.name}>
      <Flex gap={12} align="center" justify="center" class={css({ mb: 10 })}>
        <p class={css({ fontSize: 28, textAlign: "center" })}>
          {showOnlyToday()
            ? counter?.entries.filter((e) => {
                const today = dayjs(new Date()).format("DD/MM/YYYY");
                const day = dayjs(e.timestamp).format("DD/MM/YYYY");
                return day === today;
              }).length
            : counter?.entries.length}
        </p>
        <Button
          justifySelf="stretch"
          h={14}
          w={14}
          onClick={() => incrementCounter(counter!.id)}
        >
          +
        </Button>
      </Flex>
      <Stack>
        <div class={css({ h: 250, w: 500, alignSelf: "center" })}>
          <Line
            data={chartData()}
            options={chartOptions}
            height={250}
            width={500}
          />
        </div>
        <div class={css({ alignSelf: "center" })}>
          <Switch
            checked={showOnlyToday()}
            onCheckedChange={(e) => setShowOnlyDay(e.checked)}
          >
            {showOnlyToday() ? "Today" : "Total"}
          </Switch>
        </div>
        <Stack>
          <p class={css({ fontSize: 18 })}>Entries</p>
          <For each={counter!.entries.toReversed()}>
            {(entry) => (
              <Card.Root>
                <Flex justify="space-between">
                  <div class={css({ p: 4 })}>
                    <p>{dayjs(entry.timestamp).fromNow()}</p>
                  </div>
                  <Button
                    justifySelf="stretch"
                    h="auto"
                    w={12}
                    onClick={() => removeEntry(counter!.id, entry.id)}
                    variant="subtle"
                  >
                    <TbTrash />
                  </Button>
                </Flex>
              </Card.Root>
            )}
          </For>
        </Stack>
      </Stack>
    </AppLayout>
  );
};

export default Counter;
