<script lang="ts">
  import {faClock} from '@fortawesome/free-solid-svg-icons';
  import {Fa} from 'svelte-fa';

  export let time: number = -1;

</script>

<div class="outplantTimeIcon">
  <Fa class="clock" icon={faClock} />
  <p>{time}</p>
</div>

<style>
  :global(.outplantTimeIcon) {
    /*max-width: 200px;*/
    display: flex;
    flex-direction: row;
    color: #c300ff;
  }
  :global(.outplantTimeIcon p) {
    margin:0 0 0 4px;
    font-weight: bolder;
  }
</style>
