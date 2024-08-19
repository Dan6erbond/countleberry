import * as v from "valibot";

import {
  Accessor,
  Component,
  For,
  Match,
  Show,
  Signal,
  Switch,
  createEffect,
  createSignal,
} from "solid-js";
import { Bar, Line } from "solid-chartjs";
import { ChartData, ChartOptions } from "chart.js";
import { Counter, CounterEntry } from "../types/counter";
import { Flex, Stack } from "../../styled-system/jsx";
import {
  SubmitHandler,
  createForm,
  reset,
  valiForm,
} from "@modular-forms/solid";
import { TbChartBar, TbChartLine } from "solid-icons/tb";
import { counterStore, createCounter } from "../stores/counters";

import AppLayout from "../components/layout";
import { Button } from "../components/ui/button";
import CounterCard from "../components/counter-card";
import { Input } from "@/components/ui/input";
import { Switch as SwitchComponent } from "../components/ui/switch";
import { ToggleGroup } from "@ark-ui/solid";
import { css } from "../../styled-system/css";
import dayjs from "dayjs";

const counterSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
});

type CounterForm = v.InferInput<typeof counterSchema>;

type CountersChartType = "bar" | "line";

const Home: Component = () => {
  const [showChart, setShowChart] = createSignal(false);
  const [chartType, setChartType] = createSignal<CountersChartType>("bar");

  const [counterForm, { Form, Field }] = createForm<CounterForm>({
    validate: valiForm(counterSchema),
  });

  const handleCreate: SubmitHandler<CounterForm> = (values) => {
    createCounter(values.name);
    reset(counterForm);
  };

  const chartData: Accessor<ChartData> = () => {
    const days = counterStore.reduce<Record<string, Counter[]>>(
      (days, counter) => {
        const day = dayjs(counter.createdAt).format("DD/MM/YYYY");

        if (day in days) {
          days[day] = [...days[day], counter];
        } else {
          days[day] = [counter];
        }

        return days;
      },
      {}
    );

    return {
      labels: Object.keys(days),
      datasets: counterStore
        .filter((counter) => counter.entries.length > 0)
        .map((counter) => ({
          label: counter.name,
          data: Object.entries(days).map(([day, counters]) =>
            counters.findIndex((c) => c.id === counter.id) !== -1
              ? counter.entries.filter((e) => {
                  const d = dayjs(counter.createdAt).format("DD/MM/YYYY");
                  return d === day;
                }).length
              : 0
          ),
        })),
    };
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <AppLayout>
      <Stack gap={4}>
        <Flex gap={4}>
          <SwitchComponent
            checked={showChart()}
            onCheckedChange={(e) => setShowChart(e.checked)}
          >
            Show Chart
          </SwitchComponent>
          <Show when={showChart()}>
            <ToggleGroup.Root
              value={[chartType()]}
              onValueChange={(e) =>
                setChartType(
                  (e.value[0] as CountersChartType | undefined) ?? chartType()
                )
              }
            >
              <ToggleGroup.Item value="bar">
                <TbChartBar />
              </ToggleGroup.Item>
              <ToggleGroup.Item value="line">
                <TbChartLine />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </Show>
        </Flex>
        <Show when={showChart()}>
          <div class={css({ h: 250, w: 500, alignSelf: "center" })}>
            <Switch>
              <Match when={chartType() === "bar"}>
                <Bar
                  data={chartData()}
                  options={chartOptions}
                  height={250}
                  width={500}
                />
              </Match>
              <Match when={chartType() === "line"}>
                <Line
                  data={chartData()}
                  options={chartOptions}
                  height={250}
                  width={500}
                />
              </Match>
            </Switch>
          </div>
        </Show>
        <Form onSubmit={handleCreate}>
          <Flex gap={4}>
            <Field name="name">
              {(field, props) => <Input {...props} placeholder="Name" />}
            </Field>
            <Button type="submit">Add</Button>
          </Flex>
        </Form>
        <For each={counterStore}>
          {(counter) => <CounterCard counter={counter} />}
        </For>
      </Stack>
    </AppLayout>
  );
};

export default Home;
