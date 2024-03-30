<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {EventId} from '../model/todisplay/EventId';
  import {ChoiceToDisplayId, isChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
  import Select from '/@/admin-view/Select.svelte';
  import type {Event} from '../model/Event';
  import type {LinkEvent} from '../file-synchronization/LinkEvent';

  export let parentId: EventId | ChoiceToDisplayId;
  export let events: Record<string, Event>;

  let selectedEvent: string;

  const dispatch = createEventDispatcher();

  $: formResult = {
    selectedEvent,
  };
  $: errors = validate(formResult);

  interface LinkEventFormErrors {
    selectedEvent: string | undefined;
  }

  const validate = (formResult: {
    selectedEvent: string,
  }): LinkEventFormErrors => {
    console.log('validate: ' + formResult.selectedEvent);
    let errorOnEvent;

    if (!formResult.selectedEvent) {
      errorOnEvent = 'effect required';
    }
    return {
      selectedEvent: errorOnEvent,
    } as LinkEventFormErrors;
  };

  function isErrorObjectEmpty() {
    return !Object.values(errors).find(x => x);
  }

  const validateAndSubmitOnLinkEvent = (
    parentEventId: EventId | ChoiceToDisplayId,
    event: string,
  ) => {
    if (isErrorObjectEmpty()) {
      const linkEvent: LinkEvent = {
        event: {value: event} as EventId,
        parentId: parentEventId,
      };
      dispatch('linkEvent', linkEvent);
    }
  };

</script>
<div id="link-event-form">
  <h2>Link an event to this event: </h2>
  {#if isChoiceToDisplayId(parentId)}
    <h3>choice: {parentId.get()}</h3>
  {:else}
    <h3>{parentId.value}</h3>
  {/if}
  <form on:submit|preventDefault={() => validateAndSubmitOnLinkEvent(parentId, selectedEvent)}>
    <Select
      label="event"
      bind:value={selectedEvent}
      error={errors.selectedEvent}
    >
      {#each Object.entries(events) as [name, event], i}
        <option value={name}>{`${name} |  ${event.text ? event.text.substring(0, 15) : ''}`}</option>
      {/each}
    </Select>
    <button type="submit">link event</button>
  </form>
</div>
<style>
  #link-event-form button {
    text-align: center;
  }
</style>
