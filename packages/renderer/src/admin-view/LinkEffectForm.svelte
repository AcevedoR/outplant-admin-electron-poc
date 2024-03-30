<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {EventId} from '../model/todisplay/EventId';
  import {ChoiceToDisplayId, isChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
  import Select from '/@/admin-view/Select.svelte';
  import type {Effect} from '/@/model/Effect';
  import Checkbox from '/@/admin-view/Checkbox.svelte';
  import type {LinkEffect} from '/@/file-synchronization/LinkEffect';

  export let parentId: EventId | ChoiceToDisplayId;
  export let effects: Record<string, Effect>;

  let selectedEffect: string;
  let activated: boolean;

  const dispatch = createEventDispatcher();

  $: formResult = {
    selectedEffect, activated,
  };
  $: errors = validate(formResult);

  interface EventCreationFormErrors {
    selectedEffect: string | undefined;
    activated: string | undefined;
  }

  const validate = (formResult: {
    selectedEffect: string,
    activated: boolean
  }): EventCreationFormErrors => {
    console.log('validate: ' + formResult.selectedEffect);
    let errorOnActivated;

    if (!formResult.selectedEffect || formResult.selectedEffect.length < 1) {
      errorOnActivated = 'effect name required';
    }
    return {
      activated: errorOnActivated,
    } as EventCreationFormErrors;
  };

  function isErrorObjectEmpty() {
    return !Object.values(errors).find(x => x);
  }

  const validateAndSubmitOnLinkEvent = (
    parentEventId: EventId | ChoiceToDisplayId,
    effectName: string,
    activated: boolean,
  ) => {
    if (isErrorObjectEmpty()) {
      const linkEffect: LinkEffect = {
        effectName,
        parentId: parentEventId,
        activated,
      };
      dispatch('linkEffect', linkEffect);
    }
  };

</script>
<div id="event-creation-form">
  <h2>Create a new effect from parent: </h2>
  {#if isChoiceToDisplayId(parentId)}
    <h3>choice: {parentId.get()}</h3>
  {:else}
    <h3>{parentId.value}</h3>
  {/if}
  <form on:submit|preventDefault={() => validateAndSubmitOnLinkEvent(parentId, selectedEffect,activated)}>
    <Select
      label="effect"
      bind:value={selectedEffect}
    >
      {#each Object.entries(effects) as [name, effect], i}
        <option value={name}>{`${name}: ${effect.operation} ${effect.value} ${effect.target} ${effect.type}`}</option>
      {/each}
    </Select>
    <Checkbox
      label="activated"
      bind:value={activated}
    >
      <option value="true">true</option>
      <option value="false">false</option>
    </Checkbox>
    <button type="submit">link effect</button>
  </form>
</div>
<style>
  #event-creation-form button {
    text-align: center;
  }
</style>
