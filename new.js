function bestMatch(ALAHLYGoals, zamalekGoals) {
    //coding and coding..
    let leastDiff = ALAHLYGoals[0] - zamalekGoals[0];
    let least = 0;
    for(let i = 1; i<ALAHLYGoals.length; i++){
      let diff = ALAHLYGoals[i] - zamalekGoals[i];
      if ((diff > leastDiff)||(diff === leastDiff && zamelekGoals[i] > zamelekGoals[least])){
        leastDiff = diff; least = i;
      }
    }
    return least;
  }

console.log(bestMatch([6, 4],[1, 2]));