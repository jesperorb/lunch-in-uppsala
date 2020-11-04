<script>
  import Card from "./Card.svelte";
  export let items = [];
</script>

<div class="list">
  {#each items as item}
    <Card>
      <slot name="item" {item} />
    </Card>
  {/each}
</div>
