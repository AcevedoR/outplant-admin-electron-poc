<script lang="ts">
  export let value: boolean = true;
  export let label: string = 'label';
  console.log(value)
</script>

<label class="checkbox">
  <span>{label}</span>
  <input type="checkbox" bind:checked={value} on:click />
</label>

<style>
  .checkbox {
    display: block;
    width: 100%;
    margin: 10px;
    text-align: left;
  }

  .checkbox span {
    max-width: 10px;
  }

  .checkbox input {
    border-radius: 4px;
    padding: 6px 10px;
    margin: 0;
  }
</style>
