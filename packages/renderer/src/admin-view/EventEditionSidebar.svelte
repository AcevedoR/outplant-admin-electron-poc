<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';
  import TextEditor from '/@/admin-view/TextEditor.svelte';

  export let selectedContentToEdit: EventToDisplay;

  const dispatch = createEventDispatcher();

  const onSave = () => {
    console.log('saving: ' + selectedContentToEdit.text);
    dispatch('save', {
      type: 'updateEvent',
      id: selectedContentToEdit.id,
      content: selectedContentToEdit.text,
    });
  };

</script>
<div id="event-edition-sidebar">

  <h1>Admin sidebar</h1>

  <div id="selected-content-display">

    <h2>Modifying event: </h2>
    <h3>{selectedContentToEdit.id}</h3>
    <TextEditor bind:textToEdit={selectedContentToEdit.text} on:textEdited={onSave}></TextEditor>
  </div>
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
