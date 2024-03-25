<script lang="ts">
  import {faScaleUnbalanced} from '@fortawesome/free-solid-svg-icons';
  import {Fa} from 'svelte-fa';

  export let weight: number = -1;

</script>

<div class="outplantWeightIcon">
  <Fa class="weight" icon={faScaleUnbalanced} />
  <p>{weight}</p>
</div>
<style>
  :global(.outplantWeightIcon) {
    /*max-width: 200px;*/
    display: flex;
    flex-direction: row;
    color: #c300ff;
  }

  :global(.outplantWeightIcon p) {
    margin: 0 0 0 4px;
    font-weight: bolder;
  }
</style>
