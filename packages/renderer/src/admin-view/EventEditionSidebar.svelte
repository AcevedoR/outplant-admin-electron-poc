<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';
  import TextEditor from '/@/admin-view/TextEditor.svelte';
  import EventCreationForm from '/@/admin-view/EventCreationForm.svelte';
  import type {CreateEvent} from '/@/file-synchronization/CreateEvent';
  import ChoiceCreationForm from '/@/admin-view/ChoiceCreationForm.svelte';
  import type {CreateChoice} from '/@/file-synchronization/CreateChoice';

  export let selectedContentToEdit: EventToDisplay;

  let isEventCreationFormDisplayed = false;
  let isChoiceCreationFormDisplayed = false;

  enum EventOutcomeType {
    NONE, CHOICES, EVENTS
  }

  $: eventOutcomeType = getEventOutcomeType(selectedContentToEdit);
  // TODO there is a bug here, after any creation, this variable is not sync with the DOM (you still have both button available, but you should only have one)
  const getEventOutcomeType =
    (selectedContentToEdit: EventToDisplay): EventOutcomeType => {
      if (selectedContentToEdit.choices && selectedContentToEdit.choices.length > 0) {
        return EventOutcomeType.CHOICES;
      }
      if (selectedContentToEdit.next && selectedContentToEdit.next.length > 0) {
        return EventOutcomeType.EVENTS;
      }
      return EventOutcomeType.NONE;
    };

  const dispatch = createEventDispatcher();

  const onEventEdited = () => {
    console.log('saving: ' + selectedContentToEdit.text);
    dispatch('save', {
      type: 'updateEvent',
      id: selectedContentToEdit.id,
      content: selectedContentToEdit.text,
    });
  };

  const onEventCreation = (createEvent: CreateEvent) => {
    console.log('creating event: ' + createEvent.id);
    dispatch('save', {
      type: 'createEvent',
      id: createEvent.id,
      content: createEvent,
    });
    isEventCreationFormDisplayed = false;
  };

  const onChoiceCreation = (createChoice: CreateChoice) => {
    console.log('creating choice');
    dispatch('save', {
      type: 'createChoice',
      content: createChoice,
    });
    isChoiceCreationFormDisplayed = false;
  };

</script>
<div id="event-edition-sidebar">

  <h1>Admin sidebar</h1>

  {#if isEventCreationFormDisplayed}
    <EventCreationForm
      parentEventId={selectedContentToEdit.id}
      on:createEvent={(createEvent) => onEventCreation(createEvent.detail)}
    ></EventCreationForm>
  {:else if isChoiceCreationFormDisplayed}
    <ChoiceCreationForm
      parentEventId={selectedContentToEdit.id}
      on:createChoice={(createChoice) => onChoiceCreation(createChoice.detail)}
    ></ChoiceCreationForm>
  {:else}

    <div id="selected-content-display">
      <h2>Modifying event: </h2>
      <h3>{selectedContentToEdit.id}</h3>
      <TextEditor bind:textToEdit={selectedContentToEdit.text} on:textEdited={onEventEdited}></TextEditor>
    </div>
    <hr>
    {#if eventOutcomeType === EventOutcomeType.EVENTS || eventOutcomeType === EventOutcomeType.NONE}
      <div id="event-creation-section">
        <button on:click={() => isEventCreationFormDisplayed = true}>Link a new event</button>
      </div>
    {/if}
    {#if eventOutcomeType === EventOutcomeType.CHOICES || eventOutcomeType === EventOutcomeType.NONE}
      <div id="choice-creation-section">
        <button on:click={() => isChoiceCreationFormDisplayed = true}>Link a new choice</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  :global(#event-edition-sidebar) {
    text-align: center;
    width: 33%;
    right: 0;
    display: block;
    background-color: #5e548e;
    /*#e0b1cb     #3c365a*/
  }
</style>
