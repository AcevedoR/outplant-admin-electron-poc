<script lang="ts">
  import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
  import {createEventDispatcher} from 'svelte';
  import TextEditor from '/@/admin-view/TextEditor.svelte';

  export let selectedContentToEdit: ChoiceToDisplay;

  const dispatch = createEventDispatcher();

  const onSave = () => {
    console.log('saving: ' + selectedContentToEdit.text);
    dispatch('save', {
      type: 'updateChoice',
      id: selectedContentToEdit.id,
      content: selectedContentToEdit.text,
    });
  };

</script>
<div id="choice-edition-sidebar">

  <h1>Admin sidebar</h1>

  <div id="selected-content-display">

    <h2>Modifying choice: </h2>
    <h3>{selectedContentToEdit.id.get()}</h3>
    <TextEditor bind:textToEdit={selectedContentToEdit.text} on:textEdited={onSave}></TextEditor>
  </div>
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
</style>
