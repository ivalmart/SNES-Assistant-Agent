import { emulateSnesConsole } from "./snes.mjs";
import { abstractify_pos_global, map_area_offsets } from "./map_tools.mjs";


async function loadBinary(url) {
  let response = await fetch(url);
  return new Uint8Array(await response.arrayBuffer());
}

async function setupGameContainer(canvas) {
  // Loading in Super Metroid ROM
  let romBytes = await loadBinary(
    "https://cdn.glitch.global/0d099dad-c80e-470b-aef1-a82edef5ee24/super_metriod.sfc?v=1729279786153"
  );
  // Loading in Super Metroid Save State created from exporting withing the webpage
  let stateBytes = await loadBinary(
    "https://cdn.glitch.global/0d099dad-c80e-470b-aef1-a82edef5ee24/morphball.state?v=1729818175820"
  );

  let emulator = emulateSnesConsole(romBytes, stateBytes, canvas);
  let dv = new DataView(emulator.retro.get_memory_data(2).slice(0, 0x2000).buffer);

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
    const index = input_buttons.findIndex((button) => button.key === e.key);
    const keyState = `0,1,0,${index}`;
    // Checks to see if the key pressed down exists inside the keyboard inputs
    if (index != -1) {
      emulator.input_state[keyState] = 1;
    }
  });
  // Resets registered button inputs
  window.addEventListener("keyup", (e) => {
    const index = input_buttons.findIndex((button) => button.key === e.key);
    const keyState = `0,1,0,${index}`;
    // Checks to see if the key released exists inside the keyboard inputs
    if (index != -1) {
      emulator.input_state[keyState] = 0;
    }
  });
  // ------- End of Keyboard Input Handler -------
}

export class Toolkit {
  constructor(container) {
    this.container = container;
  }

  async setup() {
    await setupGameContainer(this.container);
  }

  getFunctionDeclarations() {
    return [
      {
        name: "ram_read_uint8",
        parameters: {
          type: "object",
          properties: {
            address: {
              type: "string",
              description:
                "memory address with BANK:OFFSET format, e.g. 7E:12AB",
            },
          },
          required: ["address"],
        },
      },
      {
        name: "get_player_current_room",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description:
                "current location/room of Samus/the player in the game",
            },
          },
          required: ["location"],
        },
      },
      {
        name: "get_player_status",
        parameters: {
          type: "object",
          properties: {
            energy: {
              type: "number",
              description: "current health/energy in the game",
            },
            missiles: {
              type: "number",
              description: "current missile count in the game",
            },
          },
          required: ["energy", "missiles"],
        },
      },
    ];
  }

  getFunctionCallResult(name, args, dv) {
    switch (name) {                  
      case "ram_read_uint8":
        const [bank, offset] = args.address.split(':').map(hex => parseInt(hex, 16));
        console.assert(bank == 0x7E)
        console.log(dv.getUint8(offset));
        return dv.getUint8(offset);

      case "get_player_current_room":
        return "Player is at " + [get_samus_room(dv), area_names[dv.getUint8(0x079F)]];

      case "get_player_status":
        return "Energy " + dv.getUint8(0x09C2) + " / Missiles " + dv.getUint8(0x09C6);

      default:
        return `Unknown function ${name}. Tell the user about this problem!`;
    }
  }
  
  get_samus_room(dv) {
  let address = dv.getUint16(0x79B, true);
  for (const [room_name, room_info] of Object.entries(all_rooms)) {
    const mem_addr = room_info["Memory_Address"] & 0xffff;
      if (address == mem_addr) {
        return room_name;
      }
    }
  return null;
}
}
