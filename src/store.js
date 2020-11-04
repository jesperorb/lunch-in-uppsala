import { readable, writable } from "svelte/store";
import { interpret, createMachine, assign } from "xstate";

import { getAll } from "./utils";

export const LoadingState = {
  NotLoaded: "NotLoaded",
  Loading: "Loading",
  Loaded: "Loaded",
  Failure: "Failure"
}

export const Actions = {
  Load: "Load",
  Retry: "Retry"
}

const persistedStateKey = "app.state";

const persistedState = JSON.parse(
  localStorage.getItem(persistedStateKey)
);

const setPersistedState = (state) => {
  if(state.value === LoadingState.Loaded) {
    localStorage.setItem(
      persistedStateKey,
      JSON.stringify(state.context)
    )
  }
};

export function useMachine(machine, options) {
  const service = interpret(machine, options);
  const store = readable(machine.initialState, set => {
    service.subscribe(state => {
      if (state.changed) {
        set(state);
      }
    });
    service.onTransition(setPersistedState)
    service.start();
    return () => service.stop();
  });
  return {
    state: store,
    send: service.send
  };
}

const appMachine = createMachine(
  {
    id: "app",
    initial: LoadingState.NotLoaded,
    context: {
      restaurants: [],
      errorMessage: null,
      lastUpdated: null
    },
    states: {
      [LoadingState.NotLoaded] : {
        on: {
          [Actions.Load] : {
            target: LoadingState.Loading
          }
        }
      },
      [LoadingState.Loading] : {
        invoke: {
          id: "loadRestaurants",
          src: (context, event) => getAll(),
          onDone: {
            target: LoadingState.Loaded,
            actions: assign({
              restaurants: (context, event) => event.data,
              lastUpdated: Date.now
            })
          },
          onError: {
              target: LoadingState.Failure,
              actions: assign({
                errorMessage: (context, event) => event.data
              })
          }
        }
      },
      [LoadingState.Loaded]: {
        on: {
          [LoadingState.Load]: {
            target: LoadingState.Loading
          }
        }
      },
      [LoadingState.Failure]: {
        on: {
          [Actions.Retry]: {
            target: LoadingState.Loading
          }
        }
      }
    }
  }
);

export const appStore = useMachine(appMachine, {
  state: persistedState
});
