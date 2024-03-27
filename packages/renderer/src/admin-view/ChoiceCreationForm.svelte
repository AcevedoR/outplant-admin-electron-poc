<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Input from '/@/admin-view/Input.svelte';
  import type {CreateChoice} from '/@/file-synchronization/CreateChoice';

  export let parentEventId: string;

  let newChoiceText: string = 'put your choice text here';

  const dispatch = createEventDispatcher();

  $: formResult = {
    newChoiceText: newChoiceText,
  };
  $: errors = validate(formResult);

  interface ChoiceCreationFormErrors {
    choiceText: string | undefined;
  }

  const validate = (formResult: {newChoiceText: string}): ChoiceCreationFormErrors => {
    let errorOnChoiceText;
    if (!formResult.newChoiceText || formResult.newChoiceText.length < 5) {
      errorOnChoiceText = 'Choice text is required';
    }
    return {choiceText: errorOnChoiceText} as ChoiceCreationFormErrors;
  };

  function isErrorObjectEmpty() {
    return !Object.values(errors).find(x => x);
  }

  const validateAndSubmitOnCreateChoice = (parentEventId: string, text: string) => {
    if (isErrorObjectEmpty()) {
      const createChoice: CreateChoice = {
        parentEventId, text,
      };
      dispatch('createChoice', createChoice);
    }
  };

</script>
<div id="choice-creation-form">
  <h2>Create a new choice from parent: </h2>
  <h3>{parentEventId}</h3>
  <form on:submit|preventDefault={() => validateAndSubmitOnCreateChoice(parentEventId, newChoiceText)}>
    <Input
      type="text"
      label="choice text"
      bind:value={newChoiceText}
      error={errors.choiceText}
    />
    <button type="submit">create choice</button>
  </form>
</div>
<style>
  #choice-creation-form button {
    text-align: center;
  }
</style>
