<script>
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
  }
  import { onMount } from "svelte";
  import { appStore, Actions } from "./store";

  import List from "./components/List.svelte";
  import Layout from "./components/Layout.svelte";

  const { state, send } = appStore;
  const loadState = () => send(Actions.Load);
  onMount(loadState);
</script>

<Layout state={$state}>
  <List items={$state.context.restaurants}>
    <div slot="item" let:item>
      <p>{item.name}</p>
      <p>Opens at: {item.lunchOpeningHour}</p>
      <p>{item.adress}</p>
    </div>
  </List>
</Layout>
