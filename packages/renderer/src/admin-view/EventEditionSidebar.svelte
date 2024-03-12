<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';
  import TextEditor from '/@/admin-view/TextEditor.svelte';
  import EventCreationForm from '/@/admin-view/EventCreationForm.svelte';
  import type {CreateEvent} from '/@/file-synchronization/CreateEvent';

  export let selectedContentToEdit: EventToDisplay;

  let isEditionFormDisplayed = false;

  const dispatch = createEventDispatcher();

  const onEventEdited = () => {
    console.log('saving: ' + selectedContentToEdit.text);
    dispatch('save', {
      type: 'updateEvent',
      id: selectedContentToEdit.id,
      content: selectedContentToEdit.text,
    });
  };

  const onEventCreated = (createEvent: CreateEvent) => {
    console.log('creating event: ' + createEvent.id);
    dispatch('save', {
      type: 'createEvent',
      id: createEvent.id,
      content: createEvent,
    });
    isEditionFormDisplayed = false;
  };

</script>
<div id="event-edition-sidebar">

  <h1>Admin sidebar</h1>

  {#if isEditionFormDisplayed}
    <EventCreationForm
      parentEventId={selectedContentToEdit.id}
      on:createEvent={(createEvent) => onEventCreated(createEvent.detail)}
    ></EventCreationForm>
  {:else}

    <div id="selected-content-display">
      <h2>Modifying event: </h2>
      <h3>{selectedContentToEdit.id}</h3>
      <TextEditor bind:textToEdit={selectedContentToEdit.text} on:textEdited={onEventEdited}></TextEditor>
    </div>
    <hr>
    <div id="event-creation-section">
      <button on:click={() => isEditionFormDisplayed = true}>Link a new event</button>
    </div>
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
