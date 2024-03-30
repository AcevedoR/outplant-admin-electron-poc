<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Input from '/@/admin-view/Input.svelte';
  import type {CreateEvent} from '/@/file-synchronization/CreateEvent';

  export let parentEventId: string;

  let newEventId: string;
  let newEventText: string = 'put your event text here';
  let newEventIn: number;
  let newEventWeight: number;

  const dispatch = createEventDispatcher();

  $: formResult = {
    newEventId, newEventText, newEventIn, newEventWeight,
  };
  $: errors = validate(formResult);

  interface EventCreationFormErrors {
    eventId: string | undefined,
    eventText: string | undefined,
    eventIn: string | undefined,
    eventWeight: string | undefined
  }

  const validate = (formResult: {
    newEventId: string,
    newEventText: string,
    newEventIn: number,
    newEventWeight: number
  }): EventCreationFormErrors => {
    console.log('validate: ' + formResult.newEventId);
    let errorOnEventId;
    let errorOnEventText;
    let errorOnEventIn;
    let errorOnEventWeight;

    if (!formResult.newEventId || formResult.newEventId.length < 3) {
      errorOnEventId = 'event id is required';
    }
    let regexp = '^[A-Za-z\-\_0-9]*$';
    if (formResult.newEventId && !formResult.newEventId.match(regexp)) {
      errorOnEventId = 'should match regexp ' + regexp;
    }
    if (!formResult.newEventText || formResult.newEventText.length < 5) {
      errorOnEventText = 'Event text is required';
    }
    if (formResult.newEventIn && formResult.newEventIn < 1) {
      errorOnEventIn = 'Event in should be in the future';
    }
    if (formResult.newEventWeight && formResult.newEventWeight < 1) {
      errorOnEventWeight = 'Event weight should be positive';
    }
    return {
      eventId: errorOnEventId,
      eventText: errorOnEventText,
      eventIn: errorOnEventIn,
      eventWeight: errorOnEventWeight,
    } as EventCreationFormErrors;
  };

  function isErrorObjectEmpty() {
    return !Object.values(errors).find(x => x);
  }

  const validateAndSubmitOnCreateEvent = (id: string, parentEventId: string, text: string, eventIn: number, weight: number) => {
    if (isErrorObjectEmpty()) {
      const eventCreation: CreateEvent = {
        id, parentEventId, text, in: eventIn, weight,
      };
      dispatch('createEvent', eventCreation);
    }
  };

</script>
<div id="event-creation-form">
  <h2>Create a new event from parent: </h2>
  <h3>{parentEventId}</h3>
  <form on:submit|preventDefault={() => validateAndSubmitOnCreateEvent(newEventId, parentEventId, newEventText, newEventIn, newEventWeight)}>
    <Input
      type="text"
      label="event id"
      placeholder="your-event-id"
      bind:value={newEventId}
      error={errors.eventId}
    />
    <Input
      type="text"
      label="event text"
      bind:value={newEventText}
      error={errors.eventText}
    />
    <Input
      type="number"
      label="in"
      bind:value={newEventIn}
      error={errors.eventIn}
    />
    <Input
      type="number"
      label="weight"
      bind:value={newEventWeight}
      error={errors.eventWeight}
    />
    <button type="submit">create event</button>
  </form>
</div>
<style>
  #event-creation-form button {
    text-align: center;
  }
</style>
