Like https://emulator-agent-export.glitch.me/ but without being tangled with python

Using this link currently to have smmaps and emulator run simultaneously
https://snes-agent-ui.glitch.me/smmaps.html

TODOs:
 - Make an input handler so that you can control the emulator
 - Transfer the Policy BDD to Javascript (Adam)
 - Convert the lua advice script at the start of MapPath2 - with the knowledge of where the player is trying to go, draw a line + other relevant info
 - Convert the "generate lines" part of MapPath2 (right before the big while loop) into javascript, and adapt the existing line drawing stuff to work with it instead of JSON data (requires a working policy)
 - Create a javascript version of estimate_state() in bbds/node_bdds.py - you can upload / import an existing copy of all_posns to help
 - Create a javascript version of the while loop from MapPath2 (probably best to implement as some kind of setInterval())
 
 - Start with the policy and just do single-step advice (mk_advice from bdds/node_bdds.py), then work on generating the lines
 
 
 https://github.com/matthewbauer/snes9x-next/blob/dffda6f1e44522bd1e1465a49c42e407c0c3db5d/libretro/libretro.c
 
 ```
 uint16_t snes_lut[] = { 
SNES_B_MASK,
SNES_Y_MASK,
SNES_SELECT_MASK,
SNES_START_MASK,
SNES_UP_MASK,
SNES_DOWN_MASK,
SNES_LEFT_MASK,
SNES_RIGHT_MASK,
SNES_A_MASK,
SNES_X_MASK,
SNES_TL_MASK,
SNES_TR_MASK
};
```