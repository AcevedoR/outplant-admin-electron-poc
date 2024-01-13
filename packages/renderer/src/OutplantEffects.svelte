<script lang="ts">
  import type {Effect} from './model/Effect';

  export let effects: Effect[];

</script>

<div>
  {#each effects as effect (effect)}
    <div class="outplantEffects">
      <p>effects: {`${effect.operation} ${effect.value} ${effect.target}`}
      </p>
    </div>
  {/each}
</div>

<style>
    :global(.outplantEffects) {
        flex-direction: row;
        font-size: 12px;
        max-width: 200px;
        background: #0bc00b;
        transform: skewX(-15deg);
        animation: breath2 2s .5s infinite alternate;
        opacity: 0.5;
        color: black;
    }

    :global(.svelte-flow__nodeoutplantEffects p) {
        padding: 0 10px;
        margin: 0;
        opacity: 1;
    }
</style>
