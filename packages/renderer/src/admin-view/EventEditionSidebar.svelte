<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';
  import TextEditor from '/@/admin-view/TextEditor.svelte';
  import EventCreationForm from '/@/admin-view/EventCreationForm.svelte';
  import type {CreateEvent} from '/@/file-synchronization/CreateEvent';
  import ChoiceCreationForm from '/@/admin-view/ChoiceCreationForm.svelte';
  import type {CreateChoice} from '/@/file-synchronization/CreateChoice';
  import EffectCreationForm from '/@/admin-view/EffectCreationForm.svelte';
  import type {CreateEffect} from '/@/file-synchronization/CreateEffect';
  import Button from '/@/admin-view/Button.svelte';

  export let selectedContentToEdit: EventToDisplay;

  enum CreationFormDisplayed {
    none, createEvent, createChoice, createEffect
  }

  let currentCreationFormDisplayed: CreationFormDisplayed = CreationFormDisplayed.none;

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
    currentCreationFormDisplayed = CreationFormDisplayed.none;
  };

  const onChoiceCreation = (createChoice: CreateChoice) => {
    console.log('creating choice');
    dispatch('save', {
      type: 'createChoice',
      content: createChoice,
    });
    currentCreationFormDisplayed = CreationFormDisplayed.none;
  };

  const onEffectCreation = (createEffect: CreateEffect) => {
    console.log('creating effect');
    dispatch('save', {
      type: 'createEffect',
      content: createEffect,
    });
    currentCreationFormDisplayed = CreationFormDisplayed.none;
  };

</script>
<div id="event-edition-sidebar">

  <h1>Admin sidebar</h1>

  {#if currentCreationFormDisplayed === CreationFormDisplayed.createEvent }
    <EventCreationForm
      parentEventId={selectedContentToEdit.id}
      on:createEvent={(createEvent) => onEventCreation(createEvent.detail)}
    ></EventCreationForm>
  {:else if currentCreationFormDisplayed === CreationFormDisplayed.createChoice }
    <ChoiceCreationForm
      parentEventId={selectedContentToEdit.id}
      on:createChoice={(createChoice) => onChoiceCreation(createChoice.detail)}
    ></ChoiceCreationForm>
  {:else if currentCreationFormDisplayed === CreationFormDisplayed.createEffect}
    <EffectCreationForm
      parentId={{value: selectedContentToEdit.id}}
      on:createEffect={(createEffect) => onEffectCreation(createEffect.detail)}
    ></EffectCreationForm>
  {:else if currentCreationFormDisplayed === CreationFormDisplayed.none}

    <div id="selected-content-display">
      <h2>Modifying event: </h2>
      <h3>{selectedContentToEdit.id}</h3>
      <TextEditor bind:textToEdit={selectedContentToEdit.text} on:textEdited={onEventEdited}></TextEditor>
    </div>
    <hr>
    {#if eventOutcomeType === EventOutcomeType.EVENTS || eventOutcomeType === EventOutcomeType.NONE}
      <div id="event-creation-section">
        <Button on:click={() => currentCreationFormDisplayed =  CreationFormDisplayed.createEvent}>Link a new event
        </Button>
      </div>
    {/if}
    {#if eventOutcomeType === EventOutcomeType.CHOICES || eventOutcomeType === EventOutcomeType.NONE}
      <div id="choice-creation-section">
        <Button on:click={() =>  currentCreationFormDisplayed =  CreationFormDisplayed.createChoice}>Link a new choice
        </Button>
      </div>
    {/if}
    <div id="choice-effect-creation-section">
      <Button on:click={() => currentCreationFormDisplayed =  CreationFormDisplayed.createEffect}>Link a new effect
      </Button>
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
  :global(hr){
    border: 10px solid #232223;
  }
</style>
