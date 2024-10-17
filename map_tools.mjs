var map_area_offsets = {
0: (3, 10),
1: (0, 28),
2: (31, 48),
3: (37, 0),
4: (28, 28),
5: (0, 10),
//Out of bounds
6: (0, -10),
7: (0, 0),
};

function abstractify_pos(dv) {  
  var x_radius = dv.getUint16(0x0afe);
  var y_radius = dv.getUint16(0x0b00);
  var x_center = dv.getUint16(0x0af6);
  var y_center = dv.getUint16(0x0afa);
  var top = (y_center - y_radius) / 16;
  var left = (x_center - y_radius) / 16;
  return (top, left);
}

export function abstractify_pos_global(dv, map_area_offsets) {
  // Area pos
  var area_index = dv.getUint8(0x079F);
  var aoffset = map_area_offsets[area_index];
  var area_pos = (16 * aoffset[0], 16 * aoffset[1]);
  // Map pos
  var map_x = dv.getUint8(0x07A1);
  var map_y = dv.getUint8(0x07A3);
  var map_pos = (16 * map_x, 16 * map_y);
  // Room pos
  var room_pos = abstractify_pos(dv);
  return (area_pos[0] + map_pos[0] + room_pos[0], area_pos[1] + map_pos[1] + room_pos[1]);
}