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

  export let selectedContentToEdit: ChoiceToDisplay;
  export let chainEffects: Record<string, Effect>;
  $: availableEffects = getAvailableEffects(chainEffects);

  const getAvailableEffects = (chainEffects: Record<string, Effect>): Record<string, Effect> => {
    let res: Record<string, Effect> = {};
    Object.entries(chainEffects)
      .filter(([name, effect]) => !selectedContentToEdit.effects.find(x => x.id === name))
      .forEach(([name, effect]) => res[name] = effect);
    return res;
  };

  enum CreationFormDisplayed {
    none, createEvent, createEffect, linkEffect
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
      } as CreateChoiceOutcome,
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
    <div id="choice-creation-section">
      <Button on:click={() => currentCreationFormDisplayed = CreationFormDisplayed.createEvent}>
        Create a new event/choice outcome
      </Button>
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
