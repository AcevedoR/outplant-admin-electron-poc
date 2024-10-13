<script lang="ts">
  import {BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath} from '@xyflow/svelte';
  import type {Comparator, StateVariable} from '/@/model/Choice';
  import type {IconDefinition} from '@fortawesome/free-solid-svg-icons';
  import {
    faDollarSign,
    faTree,
    faUser,
    faEquals,
    faGreaterThanEqual,
    faLessThanEqual,
    faGreaterThan,
    faLessThan,
  } from '@fortawesome/free-solid-svg-icons';
  import {Fa} from 'svelte-fa';

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

  function toIcon(target: StateVariable): IconDefinition {
    return {
      population: faUser,
      money: faDollarSign,
      ecology: faTree,
    }[target];
  }

  function toOperationChar(target: Comparator): IconDefinition {
    return {
      lt: faLessThan,
      lte: faLessThanEqual,
      eq: faEquals,
      gte: faGreaterThanEqual,
      gt: faGreaterThan,
    }[target];
  }
</script>

<BaseEdge path={edgePath} {markerEnd} {style} />
{#if data && data.condition && data.condition.target && data.condition.value && data.condition.comparator}
  <EdgeLabelRenderer>
    <div
      style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
      class="edge-label nodrag nopan"
    >
      <span>if</span>
      <span><Fa icon={toIcon(data.condition.target)} /></span>
      <span><Fa icon={toOperationChar(data.condition.comparator)} /></span>
      <span>{data.condition.value}</span>
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

  div {
    color: #c300ff;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    margin: 0 0.5em 0 0;
  }
</style>
