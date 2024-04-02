<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {EventId} from '../model/todisplay/EventId';
  import {ChoiceToDisplayId, isChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
  import Select from '/@/admin-view/Select.svelte';
  import type {Event} from '../model/Event';
  import type {LinkEvent} from '../file-synchronization/LinkEvent';
  import Input from '/@/admin-view/Input.svelte';

  export let parentId: EventId | ChoiceToDisplayId;
  export let events: Record<string, Event>;

  let selectedEvent: string;
  let linkedEventIn: number;
  let linkedEventWeight: number;

  const dispatch = createEventDispatcher();

  $: formResult = {
    selectedEvent, linkedEventIn, linkedEventWeight
  };
  $: errors = validate(formResult);

  interface LinkEventFormErrors {
    selectedEvent: string | undefined;
    eventIn: string | undefined;
    eventWeight: string | undefined;
  }

  const validate = (formResult: {
    selectedEvent: string,
    linkedEventIn: number | undefined,
    linkedEventWeight: number | undefined,
  }): LinkEventFormErrors => {
    console.log('validate: ' + formResult.selectedEvent);
    let errorOnEvent;
    let errorOnLinkedEventIn;
    let errorOnLinkedEventWeight;

    if (!formResult.selectedEvent) {
      errorOnEvent = 'effect required';
    }
    if (formResult.linkedEventIn && formResult.linkedEventIn < 1) {
      errorOnLinkedEventIn = 'Event in should be in the future';
    }
    if (formResult.linkedEventWeight && formResult.linkedEventWeight < 1) {
      errorOnLinkedEventWeight = 'Event weight should be positive';
    }
    return {
      selectedEvent: errorOnEvent,
      eventIn: errorOnLinkedEventIn,
      eventWeight: errorOnLinkedEventWeight,
    } as LinkEventFormErrors;
  };

  function isErrorObjectEmpty() {
    return !Object.values(errors).find(x => x);
  }

  const validateAndSubmitOnLinkEvent = (
    parentEventId: EventId | ChoiceToDisplayId,
    event: string,
    linkedEventIn: number | undefined,
    linkedEventWeight: number | undefined,
  ) => {
    if (isErrorObjectEmpty()) {
      const linkEvent: LinkEvent = {
        event: {value: event} as EventId,
        parentId: parentEventId,
        in: linkedEventIn,
        weight: linkedEventWeight
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
  <form on:submit|preventDefault={() => validateAndSubmitOnLinkEvent(parentId, selectedEvent, linkedEventIn, linkedEventWeight)}>
    <Select
      label="event"
      bind:value={selectedEvent}
      error={errors.selectedEvent}
    >
      {#each Object.entries(events) as [name, event], i}
        <option value={name}>{`${name} |  ${event.text ? event.text.substring(0, 15) : ''}`}</option>
      {/each}
    </Select>
    <Input
      type="number"
      label="in"
      bind:value={linkedEventIn}
      error={errors.eventIn}
    />
    <Input
      type="number"
      label="weight"
      bind:value={linkedEventWeight}
      error={errors.eventWeight}
    />
    <button type="submit">link event</button>
  </form>
</div>
<style>
  #link-event-form button {
    text-align: center;
  }
</style>
