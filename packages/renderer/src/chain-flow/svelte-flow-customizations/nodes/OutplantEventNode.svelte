<script lang="ts">
  import {Handle, type NodeProps, Position} from '@xyflow/svelte';
  import OutplantEffects from './OutplantEffects.svelte';
  import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';
  import {selectedContent} from '/@/chain-flow/svelte-flow-customizations/SelectedContentStore';
  import {isChoiceToDisplayId} from '/@/model/todisplay/ChoiceToDisplay';
  import {faBan} from '@fortawesome/free-solid-svg-icons';
  import {Fa} from 'svelte-fa';

  type $$Props = NodeProps;

  export let data: $$Props['data'];
  // export let isConnectable: $$Props['isConnectable'];
  const isConnectable = false; // disabling edge drag and drop until we implement it (maybe?)

  const event: EventToDisplay = data.event;
  if (!event) {
    throw new Error('an Event specific node should have the \'data.event\' property set');
  }

  let eventDisplayBlock: HTMLElement | undefined = undefined;
  $: {
    if (eventDisplayBlock) {
      if ($selectedContent && !isChoiceToDisplayId($selectedContent.id) && $selectedContent.id === event.id) {
        eventDisplayBlock.classList.add('focused');
      } else
        eventDisplayBlock.classList.remove('focused');
    }
  }

  function isEventTerminal(event: EventToDisplay): boolean {
    return (!event.choices || event.choices.length === 0) && (!event.next || event.next.length === 0);
  }
</script>

<Handle type="target" position={Position.Left} style="background: #555;" {isConnectable} />

{#if !isEventTerminal(event)}
  <Handle
    type="source"
    position={Position.Right}
    style={{ top: 10, background: '#555' }}
    isConnectable={isConnectable}
  />
{/if}

<div>
  <div class="eventDisplayBlock" class:is-event-terminal={isEventTerminal(event)} bind:this={eventDisplayBlock}>
    <h4>{event.id}</h4>
    <p>
      {event.text.replace(/ #.*$/i, '')}
    </p>
  </div>
  <OutplantEffects effects={event.effects} />
</div>
{#if isEventTerminal(event)}
  <Fa class="is-event-terminal-icon" icon={faBan} />
{/if}

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

  :global(.svelte-flow__node-outplantEventNode .eventDisplayBlock.is-event-terminal) {
    border: 7px solid #afaeae;
    border-style: ridge;
    text-align: center;
    padding: 10px;
  }

  :global(.svelte-flow__node-outplantEventNode .eventDisplayBlock h4) {
    margin: 0 0 5px 0;
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

  :global(.svelte-flow__node-outplantEventNode .eventDisplayBlock.focused) {
    border: 10px solid #c300ff;
  }

  :global(.svelte-flow__node-outplantEventNode  .is-event-terminal-icon) {
    margin-top: 25px;
    margin-left: -5px;
    color: #afaeae;
  }
</style>
