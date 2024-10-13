<script lang="ts">
  import {BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath} from '@xyflow/svelte';
  import OutplantTimeIcon from '/@/chain-flow/svelte-flow-customizations/edges/OutplantTimeIcon.svelte';
  import OutplantWeightIcon from '/@/chain-flow/svelte-flow-customizations/edges/OutplantWeightIcon.svelte';

  type $$Props = EdgeProps;

  export let id: $$Props['id'];
  export let sourceX: $$Props['sourceX'];
  export let sourceY: $$Props['sourceY'];
  export let sourcePosition: $$Props['sourcePosition'];
  export let targetX: $$Props['targetX'];
  export let targetY: $$Props['targetY'];
  export let targetPosition: $$Props['targetPosition'];
  export let markerEnd: $$Props['markerEnd'] = undefined;
  export let style: $$Props['style'] = undefined;
  export let data: $$Props['data'] = undefined;


  $: [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

</script>

<BaseEdge path={edgePath} {markerEnd} {style} />
{#if data && data.next && (data.next.weight || data.next.in)}
  <EdgeLabelRenderer>
    <div
      style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
      class="edge-label nodrag nopan"
    >
      {#if data.next.weight}
        <OutplantWeightIcon weight={data.next.weight}></OutplantWeightIcon>
      {/if}
      {#if data.next.in}
        <OutplantTimeIcon time={data.next.in}></OutplantTimeIcon>
      {/if}
    </div>
  </EdgeLabelRenderer>
{/if}

<style>
  .edge-label {
    position: absolute;
    background: none;
    border: rgba(224, 224, 224, 0.29) 1px dotted;
    padding: 5px;
    border-radius: 100px;
    font-size: 12px;
  }

</style>
