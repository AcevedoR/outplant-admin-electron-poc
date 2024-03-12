<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  export let textToEdit: string;

  const dispatch = createEventDispatcher();

  function onTextSave() {
    dispatch('textEdited', {
      textToEdit,
    });
  }


  let is_alt_down = false;
  let is_enter_down = false;

  function on_key_down(event: {repeat: boolean, key: string, preventDefault: () => void}) {
    if (event.repeat) return;
    switch (event.key) {
      case 'Alt':
        is_alt_down = true;
        // By using `preventDefault`, it tells the Browser not to handle the
        // key stroke for its own shortcuts or text input.
        event.preventDefault();
        break;
      case 'Meta':
        is_alt_down = true;
        event.preventDefault();
        break;

      case 'Enter':
        is_enter_down = true;
        break;
    }

    if (is_enter_down && is_alt_down) {
      is_alt_down = false;
      is_enter_down = false;
      onTextSave();
    }
  }

  function on_key_up(event: {repeat: boolean, key: string, preventDefault: () => void}) {
    if (event.repeat) return;
    switch (event.key) {
      case 'Alt':
        is_alt_down = false;
        event.preventDefault();
        break;
      case 'Meta':
        is_alt_down = false;
        event.preventDefault();
        break;

      case 'Enter':
        is_enter_down = false;
        event.preventDefault();
        break;
    }
  }
</script>

<textarea id="selected-content-editor" bind:value={textToEdit}
          on:keyup={on_key_up}
          on:keydown={on_key_down} />
<button on:click={onTextSave}>Save</button>

<style>
  :global(#selected-content-editor) {
    display: block;
    width: 90%;
    margin: auto;
    height: 500px;
    border: 1px solid black;
    background-color: rgba(213, 193, 145, 0.65);
    padding: 20px;
  }
</style>
