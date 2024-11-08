// Main functions the assist bot will call for getting what's needed
export const functionDeclarations = [
  {
    name: "get_player_current_room",
    parameters: {
      type: "object",
      properties: {
        room: {
          type: "string",
          description: "current area room in the game",
        },
      },
      required: ["room"],
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
  // {
  //   name: "set_health",
  //   parameters: {
  //     type: "object",
  //     properties: {
  //       health: {
  //         type: "health",
  //         description: "Changed health value or energy value to a new number value",
  //       },
  //     },
  //     required: ["health"],
  //   },
  // },
  {
    name: "get_register",
    parameters: {
      type: "object",
      properties: {
        register_name: {
          type: "string",
          description: "Name of the machine register, r0 to r31",
        },
      },
      required: ["register_name"],
    },
  },
  {
    name: "set_register",
    parameters: {
      type: "object",
      properties: {
        register_name: {
          type: "string",
          description: "Name of the machine register, r0 to r31",
        },
        value: {
          type: "number",
          description:
            "numeric immediate to set this register's value to",
        },
      },
      required: ["register_name", "value"],
    },
  },
  {
    name: "add_registers",
    parameters: {
      type: "object",
      properties: {
        source_register_a: {
          type: "string",
          description: "Name of the machine register, r0 to r31",
        },
        source_register_b: {
          type: "string",
          description: "Name of the machine register, r0 to r31",
        },

        destination_register: {
          type: "number",
          description: "Name of the machine register, r0 to r31",
        },
      },
      required: [
        "source_register_a",
        "source_register_b",
        "destination_register",
      ],
    },
  },

]