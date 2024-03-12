<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Input from '/@/admin-view/Input.svelte';
  import type {CreateEvent} from '/@/file-synchronization/CreateEvent';

  export let parentEventId: string;

  let newEventId: string;
  let newEventText: string = 'put your event text here';

  const dispatch = createEventDispatcher();

  $: formResult = {
    newEventId, newEventText,
  };
  $: errors = validate(formResult);

  interface EventCreationFormErrors {
    eventId: string | undefined,
    eventText: string | undefined
  }

  const validate = (formResult: {newEventId: string, newEventText: string}): EventCreationFormErrors => {
    console.log('validate: ' + formResult.newEventId);
    let errorOnEventId;
    let errorOnEventText;
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
    return {eventId: errorOnEventId, eventText: errorOnEventText} as EventCreationFormErrors;
  };

  function isErrorObjectEmpty() {
    return !Object.values(errors).find(x => x);
  }

  const validateAndSubmitOnCreateEvent = (id: string, parentEventId: string, text: string) => {
    if (isErrorObjectEmpty()) {
      const eventCreation: CreateEvent = {
        id, parentEventId, text,
      };
      dispatch('createEvent', eventCreation);
    }
  };

</script>
<div id="event-creation-form">
  <h2>Create a new event from parent: </h2>
  <h3>{parentEventId}</h3>
  <form on:submit|preventDefault={() => validateAndSubmitOnCreateEvent(newEventId, parentEventId, newEventText)}>
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
    <button type="submit">create event</button>
  </form>
</div>
<style>
  #event-creation-form button {
    text-align: center;
  }
</style>
