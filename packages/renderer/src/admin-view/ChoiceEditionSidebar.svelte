<script lang="ts">
  import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
  import {createEventDispatcher} from 'svelte';
  import TextEditor from '/@/admin-view/TextEditor.svelte';
  import EventCreationForm from '/@/admin-view/EventCreationForm.svelte';
  import type {CreateEvent} from '/@/file-synchronization/CreateEvent';
  import type {CreateChoiceOutcome} from '/@/file-synchronization/CreateChoiceOutcome';
  import EffectCreationForm from '/@/admin-view/EffectCreationForm.svelte';
  import type {CreateEffect} from '/@/file-synchronization/CreateEffect';
  import Button from '/@/admin-view/Button.svelte';
  import LinkEffectForm from '/@/admin-view/LinkEffectForm.svelte';
  import type {LinkEffect} from '/@/file-synchronization/LinkEffect';
  import type {Effect} from '/@/model/Effect';
  import {getAvailableEffects, getAvailableEvents} from '/@/admin-view/utils';
  import {faDiagramProject, faDollarSign, faTree, faUser} from '@fortawesome/free-solid-svg-icons';
  import {Fa} from 'svelte-fa';
  import LinkEventForm from '/@/admin-view/LinkEventForm.svelte';
  import type {LinkEvent} from '/@/file-synchronization/LinkEvent';
  import type {Event} from '/@/model/Event';

  export let selectedContentToEdit: ChoiceToDisplay;
  export let chainEffects: Record<string, Effect>;
  export let chainEvents: Record<string, Event>;
  $: availableEffects = getAvailableEffects(chainEffects, selectedContentToEdit.effects);
  $: availableEvents = getAvailableEvents(chainEvents, selectedContentToEdit.next);

  enum CreationFormDisplayed {
    none, createEvent, linkEvent, createEffect, linkEffect
  }

  let currentCreationFormDisplayed = CreationFormDisplayed.none;

  const dispatch = createEventDispatcher();

  const onSave = () => {
    console.log('saving: ' + selectedContentToEdit.text);
    dispatch('save', {
      type: 'updateChoice',
      id: selectedContentToEdit.id,
      content: selectedContentToEdit.text,
    });
  };

  const onEventCreation = (createEvent: CreateEvent) => {
    console.log('creating event: ' + createEvent.id);
    dispatch('save', {
      type: 'createChoiceOutcome',
      id: createEvent.id,
      content: {
        parentId: selectedContentToEdit.id,
        text: createEvent.text,
        id: createEvent.id,
        in: createEvent.in,
        weight: createEvent.weight,
      } as CreateChoiceOutcome,
    });
    currentCreationFormDisplayed = CreationFormDisplayed.none;
  };

  const onLinkEvent = (linkEvent: LinkEvent) => {
    console.log('linking event');
    dispatch('save', {
      type: 'linkEvent',
      content: linkEvent,
    });
    currentCreationFormDisplayed = CreationFormDisplayed.none;
  };

  const onEffectCreation = (createEffect: CreateEffect) => {
    console.log('creating effect: ' + createEffect.effectName);
    dispatch('save', {
      type: 'createEffect',
      content: createEffect,
    });
    currentCreationFormDisplayed = CreationFormDisplayed.none;
  };

  const onEffectLink = (linkEffect: LinkEffect) => {
    console.log('linking effect: ' + linkEffect.effectName);
    dispatch('save', {
      type: 'linkEffect',
      content: linkEffect,
    });
    currentCreationFormDisplayed = CreationFormDisplayed.none;
  };
</script>

<div id="choice-edition-sidebar">

  <h1>Admin sidebar</h1>

  {#if currentCreationFormDisplayed === CreationFormDisplayed.createEvent}
    <EventCreationForm
      parentEventId={selectedContentToEdit.id.get()}
      on:createEvent={(msg) => onEventCreation(msg.detail)}
    ></EventCreationForm>
  {:else if currentCreationFormDisplayed === CreationFormDisplayed.linkEvent}
    <LinkEventForm
      parentId={selectedContentToEdit.id}
      events={availableEvents}
      on:linkEvent={(msg) => onLinkEvent(msg.detail)}
    ></LinkEventForm>
  {:else if currentCreationFormDisplayed === CreationFormDisplayed.createEffect}
    <EffectCreationForm
      parentId={selectedContentToEdit.id}
      on:createEffect={(msg) => onEffectCreation(msg.detail)}
    ></EffectCreationForm>
  {:else if currentCreationFormDisplayed === CreationFormDisplayed.linkEffect}
    <LinkEffectForm
      parentId={selectedContentToEdit.id}
      effects={availableEffects}
      on:linkEffect={(msg) => onEffectLink(msg.detail)}
    ></LinkEffectForm>
  {:else if currentCreationFormDisplayed === CreationFormDisplayed.none}
    <div id="selected-content-display">
      <h2>Modifying choice: </h2>
      <h3>{selectedContentToEdit.id.get()}</h3>
      <TextEditor bind:textToEdit={selectedContentToEdit.text} on:textEdited={onSave}></TextEditor>
    </div>
    <hr>
    <Fa icon={faDiagramProject} size="2x"></Fa>
    <div id="choice-creation-section">
      <Button on:click={() => currentCreationFormDisplayed = CreationFormDisplayed.createEvent}>
        Create a new event/choice outcome
      </Button>
    </div>
    <div id="link-choice-to-event-section">
      <Button on:click={() => currentCreationFormDisplayed = CreationFormDisplayed.linkEvent}>
        Link an existing event/choice outcome
      </Button>
    </div>
    <hr>
    <div>
      <Fa icon={faUser} size="2x"></Fa>
      <Fa icon={faTree} size="2x"></Fa>
      <Fa icon={faDollarSign} size="2x"></Fa>
    </div>
    <div id="choice-effect-creation-section">
      <Button on:click={() => currentCreationFormDisplayed = CreationFormDisplayed.createEffect}>
        Create a new effect
      </Button>
    </div>
    <div id="choice-effect-link-section">
      <Button on:click={() => currentCreationFormDisplayed = CreationFormDisplayed.linkEffect}>
        Link an existing effect
      </Button>
    </div>
  {/if}
</div>

<style>
  :global(#choice-edition-sidebar) {
    text-align: center;
    width: 33%;
    right: 0;
    display: block;
    background-color: #5e548e;
    /*#e0b1cb     #3c365a*/
  }

  :global(#choice-edition-sidebar #selected-content-editor) {
    display: block;
    width: 90%;
    margin: auto;
    height: 500px;
    border: 1px solid black;
    background-color: rgba(213, 193, 145, 0.65);
    padding: 20px;
  }

  :global(hr) {
    border: 10px solid #232223;
  }
</style>
