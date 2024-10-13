<script lang="ts">
  import {BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath} from '@xyflow/svelte';
  import OutplantTimeIcon from '/@/chain-flow/svelte-flow-customizations/edges/OutplantTimeIcon.svelte';
  import OutplantWeightIcon from '/@/chain-flow/svelte-flow-customizations/edges/OutplantWeightIcon.svelte';
  import type { Comparator, StateVariable } from '/@/model/Choice';
  import {
    faDollarSign,
    faTree,
    faUser,
    faEquals,
    faNotEqual,
    faGreaterThanEqual,
    faLessThanEqual,
    faGreaterThan,
    faLessThan,
    type IconDefinition,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

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

  function toOperationIcon(target: Comparator): IconDefinition {
    return {
      lt: faLessThan,
      lte: faLessThanEqual,
      eq: faEquals,
      gte: faGreaterThanEqual,
      gt: faGreaterThan,
      not: faNotEqual,
    }[target];
  }

  function isStateCondition(condition: any) {
    console.log("msdkfjgdhdk", condition)
    if (!!condition) {
      return condition.target === "population" || condition.target === "money" || condition.target === "ecology"
    }
    return false;
  }

</script>

<BaseEdge path={edgePath} {markerEnd} {style} />
{#if data && (data.weight || data.in || data.if)}
  <EdgeLabelRenderer>
    <div
      style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
      class="edge-label nodrag nopan"
    >
      {#if data.if && isStateCondition(data.if) }
        <div class="condition_div">
          <span>if</span>
          <span><Fa icon={toIcon(data.if.target)} /></span>
          <span><Fa icon={toOperationIcon(data.if.comparator)} /></span>
          <span>{data.if.value}</span>
        </div>
      {:else if data.if}
        <div class="condition_div">
          <span>if</span>
          <span>{data.if.target}</span>
          <span><Fa icon={toOperationIcon(data.if.comparator)} /></span>
          <span>{data.if.value}</span>
        </div>
      {/if}
      {#if data.weight}
        <OutplantWeightIcon weight={data.weight}></OutplantWeightIcon>
      {/if}
      {#if data.in}
        <OutplantTimeIcon time={data.in}></OutplantTimeIcon>
      {/if}
    </div>
  </EdgeLabelRenderer>
{/if}

<style>
  .edge-label {
    display: flex;
    flex-direction: column;
    position: absolute;
    background: none;
    border: rgba(224, 224, 224, 0.29) 1px dotted;
    padding: 5px;
    border-radius: 10px;
    font-size: 12px;
    align-items: center;
  }

  .condition_div {
    color: #c300ff;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    margin: 0 0.5em 0 0;
  }

  span:last-child {
    margin: 0;
  }
</style>
