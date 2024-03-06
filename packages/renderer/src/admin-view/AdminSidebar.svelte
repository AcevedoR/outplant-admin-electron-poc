<script lang="ts">
  import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
  import {createEventDispatcher} from 'svelte';

  export let selectedContentToEdit: ChoiceToDisplay; // TODO we will need to allow multiple types

  const dispatch = createEventDispatcher();

  const onSave = () => {
    console.log("saving: " + selectedContentToEdit.text)
    dispatch('save', {
      type: 'updateChoice',
      id: selectedContentToEdit.id,
      content: selectedContentToEdit.text,
    });
  };

  let is_alt_down = false;
  let is_enter_down = false;

  function on_key_up(event: any) {
    if (event.repeat) return;
    switch (event.key) {
      case "Alt":
        is_alt_down = true;
        // By using `preventDefault`, it tells the Browser not to handle the
        // key stroke for its own shortcuts or text input.
        event.preventDefault();
        break;
      case "Meta":
        is_alt_down = true;
        event.preventDefault();
        break;

      case "Enter":
        is_enter_down = true;
        event.preventDefault();
        break;
    }

    if (is_enter_down && is_alt_down) {
      onSave();
    }
  }

</script>
<div id="admin-sidebar">

  <h1>Admin sidebar</h1>

  <div id="selected-content-display">

    <h2>Modifying choice: </h2>
    <h3>{selectedContentToEdit.id.get()}</h3>
    <!--    TODO we will need to handle multiple cases, with switch/case and/or instanceof ? -->
    <!--    TODO maybe separate each component viewer (choiceEdition, eventEdition) -->
    <textarea id="selected-content-editor" type="text" bind:value={selectedContentToEdit.text} on:keyup={on_key_up}/>
    <button on:click={onSave}>Save</button>

  </div>
</div>

<style>
  :global(#admin-sidebar) {
    text-align: center;
    width: 33%;
    right: 0;
    display: block;
    background-color: #5e548e;
    /*#e0b1cb     #3c365a*/
  }

  :global(#admin-sidebar #selected-content-editor) {
    display: block;
    width: 90%;
    margin: auto;
    height: 500px;
    border: 1px solid black;
    background-color: rgba(213, 193, 145, 0.65);
    padding: 20px;
  }
</style>
