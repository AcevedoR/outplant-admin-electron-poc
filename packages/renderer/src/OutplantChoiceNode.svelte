<script lang="ts">
  import {Handle, type NodeProps, Position} from '@xyflow/svelte';
  import OutplantEffects from '/@/OutplantEffects.svelte';
  import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
  import type  {Choice} from '/@/model/Choice';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let isConnectable: $$Props['isConnectable'];

  const choice:ChoiceToDisplay= data.choice;
  if(!choice){
    throw new Error("a Choice specific node should have the 'data.choice' property set");
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
  <div class="eventDisplayBlock">
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
</style>
