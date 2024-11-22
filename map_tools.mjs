export const map_area_names = {
  0: "Crateria",
  1: "Brinstar",
  2: "Norfair",
  3: "Wrecked Ship",
  4: "Maridia",
  5: "Tourian",
  6: "Ceres",
  7: "Debug",
};

export const map_area_offsets = {
  0: [3, 10],
  1: [0, 28],
  2: [31, 48],
  3: [37, 0],
  4: [28, 28],
  5: [0, 10],
  //Out of bounds
  6: [0, -10],
  7: [0, 0],
};

export const crateria2_offset = [7, 0];
export const crateria2_rooms = [
  "East_Ocean",
  "Forgotten_Highway",
  "Crab_Maze",
  "Crateria_Power_Door",
  "Crateria_Maridia_Shaft",
];

function abstractify_pos(dv) {  
  const x_radius = dv.getInt16(0x0afe, true);
  const y_radius = dv.getInt16(0x0b00, true);
  const x_center = dv.getInt16(0x0af6, true);
  const y_center = dv.getInt16(0x0afa, true);
  const top = (y_center - y_radius) / 16;
  const left = (x_center - y_radius) / 16;
  return [left, top];
}

export function abstractify_pos_global(dv, map_area_offsets) {
  // Area pos
  const area_index = dv.getUint8(0x079F);
  const aoffset = map_area_offsets[area_index];
  const area_pos = [16 * aoffset[0], 16 * aoffset[1]];
  // Map pos
  const map_x = dv.getUint8(0x07A1);
  const map_y = dv.getUint8(0x07A3);
  const map_pos = [16 * map_x, 16 * map_y];
  // Room pos
  const room_pos = abstractify_pos(dv);
  const pos = [area_pos[0] + map_pos[0] + room_pos[0], area_pos[1] + map_pos[1] + room_pos[1]]
  return pos;
}