<script>
  export let value;
  export let error = '';
  export let label = '';
</script>

<div class="select">
  {#if label}
    <span class="block">{label}</span>
  {/if}

  <select class="block select" class:error bind:value on:blur>
    <slot />
  </select>

  {#if error}
    <span class="block error-text">{error}</span>
  {/if}
</div>

<style>
  .select {
    width: 70%;
    margin: 10px;
    text-align: left;
  }

  .select span {
    max-width: 10px;
  }

  .select select {
    border-radius: 4px;
    padding: 6px 10px;
    margin: 0;
  }

  .error {
    border-color: #f55;
  }

  .error-text {
    color: #f55;
  }
</style>
