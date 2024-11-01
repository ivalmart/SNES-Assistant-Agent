import satisfyingSolutions from "./bdd.js";

let currentBdd;

onmessage = function (event) {
  switch (event.data.command) {
    case "configure":
      currentBdd = event.data.bdd;
      break;
    case "count":
      postMessage(
        satisfyingSolutions(
          currentBdd,
          event.data.rootId,
          event.data.assumptions
        ).length
      );
      break;
    case "first":
      postMessage(
        satisfyingSolutions(
          currentBdd,
          event.data.rootId,
          event.data.assumptions
        )
          [Symbol.iterator]()
          .next().value
      );
      break;
  }
};
