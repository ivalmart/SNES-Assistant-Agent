export default function satisfyingSolutions(bdd, rootId, assumptions) {
  const levelToKey = Object.fromEntries(
    Object.entries(bdd["level_of_var"]).map(([key, level]) => [level, key])
  );

  const bindingStack = [];
  function* enumerate(nodeId, sat) {
    switch(nodeId) {
      case "F":
        if(!sat) yield Object.fromEntries(bindingStack);
      case "T":
        if(sat) yield Object.fromEntries(bindingStack);
      case nodeId < 0:
        sat = !sat;
        nodeId = -nodeId;
      default:
        // nothing
    }

    const [level, lo, hi] = bdd[nodeId];
    const key = levelToKey[level];

    if (assumptions[key] !== true) {
      bindingStack.push([key, false]);
      yield* enumerate(lo, sat);
      bindingStack.pop();
    }

    if (assumptions[key] !== false) {
      bindingStack.push([key, true]);
      yield* enumerate(hi, sat);
      bindingStack.pop();
    }
  }

  const count_table = {};
  function count(nodeId, sat) {
    switch(nodeId) {
      case "F":
        return !sat ? 1n : 0n;
      case "T":
        return sat ? 1n : 0n;
      case nodeId < 0:
        sat = !sat;
        nodeId = -nodeId;
      default:
        // nothing
    }

    const memoKey = [nodeId,sat];
    if (count_table[memoKey] != undefined) {
      return count_table[memoKey];
    }

    if (nodeId < 0) {
      sat = !sat;
      nodeId = -nodeId;
    }

    const [level, lo, hi] = bdd[nodeId];
    const key = levelToKey[level];

    let total = 0n;
    if (assumptions[key] !== true) {
      total += count(lo, sat);
    }
    if (assumptions[key] !== false) {
      total += count(hi, sat);
    }
    count_table[memoKey] = total;
    return total;
  }

  const nodeId = bdd.roots[rootId];

  return {
    get length() {
      return count(nodeId, true);
    },
    [Symbol.iterator]: function* () {
      yield* enumerate(nodeId, true);
    },
  };
}
