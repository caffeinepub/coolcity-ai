actor {
  var simulationCount = 0;

  public query ({ caller }) func ping() : async Text {
    "CoolCity AI online";
  };

  public shared ({ caller }) func recordSimulation() : async Nat {
    simulationCount += 1;
    simulationCount;
  };

  public query ({ caller }) func getSimulationCount() : async Nat {
    simulationCount;
  };
};
