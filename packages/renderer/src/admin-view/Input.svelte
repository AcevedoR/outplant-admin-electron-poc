<script>
  // see https://svelte.dev/repl/c399ebf9700b4b25bf6fce7d0b3d4ffd?version=4.2.12 for error handling
  export let type = 'text';
  export let value = type === 'text' ? '' : null;
  export let error = '';
  export let label = '';
  export let placeholder = '';

  function handleInput({target: t}) {
    if (type === 'number') {
      value = t.value === '' ? null : t.valueAsNumber;
    } else {
      value = t.value;
    }
  }
</script>


<div class="input">
  {#if label}
    <span>{label}</span>
  {/if}
  <input
    class:error
    {type}
    {placeholder}
    {value}
    on:input={handleInput}
    on:input
    on:blur
  />
  {#if error}
    <span class="error-text">{error}</span>
  {/if}
</div>

<style>
  .input {
    width: 100%;
    margin: 10px;
    text-align: left;
  }

  .input span {
    max-width: 10px;
  }

  .input input {
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
