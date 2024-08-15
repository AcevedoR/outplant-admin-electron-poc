<script lang="ts">
  import {Handle, type NodeProps, Position} from '@xyflow/svelte';
  import OutplantEffects from './OutplantEffects.svelte';
  import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
  import {selectedContent} from '/@/chain-flow/svelte-flow-customizations/SelectedContentStore';
  import {isChoiceToDisplayId} from '/@/model/todisplay/ChoiceToDisplay.js';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  // export let isConnectable: $$Props['isConnectable'];
  const isConnectable = false; // disabling edge drag and drop until we implement it (maybe?)

  const choice: ChoiceToDisplay = data.choice;

  if (!choice) {
    throw new Error('a Choice specific node should have the \'data.choice\' property set');
  }

  let eventDisplayBlock: HTMLElement |undefined = undefined;
  $: {
    if (eventDisplayBlock) {
      if ($selectedContent && isChoiceToDisplayId($selectedContent.id) && $selectedContent.id === choice.id) {
        eventDisplayBlock.classList.add('focused');
      } else
        eventDisplayBlock.classList.remove('focused');
    }
  }
</script>

<Handle type="target" position={Position.Left} style="background: #555;" {isConnectable} />
<Handle
  type="source"
  position={Position.Right}
  style={{ top: 10, background: '#555' }}
  isConnectable={isConnectable}
/>
<div>
  <div class="eventDisplayBlock" bind:this={eventDisplayBlock}>
    {choice.text.replace(/ #.*$/i, '')}
  </div>
  <OutplantEffects effects={choice.effects} />
</div>

<style>
  :global(.svelte-flow__node-outplantChoiceNode ) {
    display: flex;
  }

  :global(.svelte-flow__node-outplantChoiceNode .eventDisplayBlock) {
    flex-direction: row;
    font-size: 12px;
    max-width: 200px;
    background: #afaeae;
    border: 1px solid #818181;
    border-radius: 10%;
    text-align: center;
    padding: 10px;
  }

  :global(.svelte-flow__node-outplantChoiceNode .eventDisplayBlock.focused) {
    border: 10px solid #c300ff;
  }
</style>
