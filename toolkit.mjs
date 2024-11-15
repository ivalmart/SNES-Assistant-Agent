import { emulateSnesConsole } from "./snes.mjs";

async function setupCanvas(canvas) {
  // Loading in Super Metroid ROM
  let romBytes = await loadBinary(
    "https://cdn.glitch.global/0d099dad-c80e-470b-aef1-a82edef5ee24/super_metriod.sfc?v=1729279786153"
  );
  // Loading in Super Metroid Save State created from exporting withing the webpage
  let stateBytes = await loadBinary(
    "https://cdn.glitch.global/0d099dad-c80e-470b-aef1-a82edef5ee24/morphball.state?v=1729818175820"
  );

  let emulator = emulateSnesConsole(romBytes, stateBytes, canvas);

  // Drawing on emulator space
  let context = emulator.canvas.getContext("2d");
  context.strokeStyle = "yellow";
  context.lineWidth = 2;
  context.fillStyle = "yellow";
  context.font = "16px monospace";

  function afterRun() {
    // ...
  }

  emulator.addEventListener("afterRun", afterRun);

  // ------- Keyboard-to-Game Controller Input Handler -------
  const input_buttons = [
    { key: "l", value: "B" }, // B button, 0
    { key: "k", value: "Y" }, // Y button, 1
    { key: "Shift", value: "Select" }, // Select button, 2
    { key: "Enter", value: "Start" }, // Start button, 3
    { key: "w", value: "Up" }, // Up button, 4
    { key: "s", value: "Down" }, // Down button, 5
    { key: "a", value: "Left" }, // Left button, 6
    { key: "d", value: "Right" }, // Right button, 7
    { key: "p", value: "A" }, // A button, 8
    { key: "o", value: "X" }, // X button, 9
    { key: "q", value: "LeftTrigger" }, // Left bumper, 10
    { key: "e", value: "RightTrigger" }, // Right bumper, 11
  ];

  // Helper function
  function findInputIndex(key) {
    return input_buttons.findIndex((button) => button.key === key);
  }

  // Registers keyboard Inputs through the Page Window
  // Connects keyboard inputs into emulator controls
  window.addEventListener("keydown", (e) => {
    const index = findInputIndex(e.key);
    const keyState = `0,1,0,${index}`;
    // Checks to see if the key pressed down exists inside the keyboard inputs
    if (index != -1) {
      emulator.input_state[keyState] = 1;
    }
  });
  // Resets registered button inputs
  window.addEventListener("keyup", (e) => {
    const index = findInputIndex(e.key);
    const keyState = `0,1,0,${index}`;
    // Checks to see if the key released exists inside the keyboard inputs
    if (index != -1) {
      emulator.input_state[keyState] = 0;
    }
  });
  // ------- End of Keyboard Input Handler -------
}

export class Toolkit {
  constructor(emulatorCanvas) {
    this.emulatorCanvas = emulatorCanvas;
  }

  async setup() {
    await setupCanvas(this.emulatorCanvas);
  }

  getFunctionDeclarations() {
    return [];
  }

  getFunctionCallResult(name, args) {
    return "ok";
  }
}
