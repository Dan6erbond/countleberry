import { Counter } from "../types/counter";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { v4 as uuidv4 } from "uuid";

export const [counterStore, setCounterStore] = makePersisted(
  createStore<Counter[]>([])
);

export const incrementCounter = (id: string) =>
  setCounterStore(
    (counter) => counter.id === id,
    "entries",
    (entries) => [...entries, { id: uuidv4(), timestamp: new Date() }]
  );

export const removeEntry = (counterId: string, id: string) =>
  setCounterStore(
    (counter) => counter.id === counterId,
    "entries",
    (entries) => entries.filter((e) => e.id === id)
  );

export const createCounter = (name: string) =>
  setCounterStore(counterStore.length, {
    name,
    id: uuidv4(),
    entries: [],
    createdAt: new Date(),
  });

export const removeCounter = (id: string) =>
  setCounterStore(counterStore.filter((c) => c.id !== id));
