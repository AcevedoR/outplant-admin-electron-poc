<script lang="ts">
  import {Handle, type NodeProps, Position} from '@xyflow/svelte';
  import OutplantEffects from './OutplantEffects.svelte';
  import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  // export let isConnectable: $$Props['isConnectable'];
  const isConnectable = false; // disabling edge drag and drop until we implement it (maybe?)

  const event: EventToDisplay = data.event;
  if (!event) {
    throw new Error('an Event specific node should have the \'data.event\' property set');
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
    <h4>{event.id}</h4>
    <p>
      {event.text.replace(/ #.*$/i, '')}
    </p>
  </div>
  <OutplantEffects effects={event.effects} />
</div>

<style>
  :global(.svelte-flow__node-outplantEventNode) {
    display: flex;
  }

  :global(.svelte-flow__node-outplantEventNode .eventDisplayBlock) {
    font-size: 12px;
    background: #deab36;
    border: 1px solid #555;
    text-align: center;
    padding: 10px;
  }

  :global(.svelte-flow__node-outplantEventNode .eventDisplayBlock h4) {
    margin: 0   0 5px 0;
    padding: 0;
  }

  :global(.svelte-flow__node-outplantEventNode .eventDisplayBlock p) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    margin: 0;
    padding: 0;
  }
</style>
