<script>
  import { LoadingState } from "../store";
  import Loading from "./Loading.svelte";
  import Error from "./Error.svelte";
  export let state = {
      value: LoadingState.NotLoaded,
      context: { errorMessage: null, restaurants: [] }
  };
</script>

<main>
    {#if state.value === LoadingState.NotLoaded}
      <div/>
    {:else if state.value === LoadingState.Loading}
      <Loading />
    {:else if state.value === LoadingState.Loaded}
      <slot></slot>
    {:else if state.value === LoadingState.Failure}
      <Error message={state.context.errorMessage} />
    {/if}
</main>