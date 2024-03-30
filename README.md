# outplant admin electron poc

A POC of **@xyflow/svelte** running in **electron** with **vite** for our [Outplant \(in development\) game](https://github.com/AcevedoR/outplant). It should launch an electron app and display a beautiful graph like this:
![expected-app-result.png](expected-app-result.png)

I don't know what half of the confs are doing, there is probably a lot of things to fix and clean, but at least it works..

## Running
```
npm install
npm run watch
```

generated from https://github.com/cawa-93/vite-electron-builder

## Usage
if you are writing a Chain/story for our [Outplant \(in development\) game](https://github.com/AcevedoR/outplant), 
you probably want to pull the game repository and set the following **environment variable** to your desired location: `CHAINS_DIRECTORY_ABSOLUTE_PATH=/my-git-repos/Outplant/chains`

## TODO
- write mode
  - ~create event~
  - ~create a choice~
  - ~create event from choice~
  - link another choice from event
  - ~link another event from event~
  - ~create an effect from event~
  - ~create an effect from a choice~
  - ~link an effect to event~
  - ~link an effect to choice~
  - remove effect
  - edit effect
  - edit 'in' and 'weight'
