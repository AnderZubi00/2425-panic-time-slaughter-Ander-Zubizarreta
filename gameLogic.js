const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

const morningCycle = (characters, foodItems) => {
  const results = [];

  characters.forEach((character) => {
    // Descanso
    character.stats.strength += 1;
    character.stats.dexterity += 1;

    // Recoleccion
    const roll = rollDice(100);
    let reward;

    if (roll <= 30) {
      reward = { type: 'gold', amount: 1 };
      character.equipment.pouch.gold += 1;
    } else if (roll <= 80) {
      reward = { type: 'coins', amount: rollDice(20) };
      character.equipment.pouch.coins += reward.amount;
    } else {
      reward = { type: 'precious_stone', stone: 'random' };
      character.equipment.pouch.precious_stones.push('random');
    }

    // Obtiene una pieza de alimento aleatoria
    const food = foodItems[rollDice(foodItems.length) - 1];
    character.equipment.saddlebag.push(food);

    results.push({
      character: character.name,
      reward,
      food
    });
  });

  return results;
};

const middayCycle = (team) => {
  // Travesis
  const kmsTraveled = rollDice(10);
  team.kmTotal += kmsTraveled;
  return { kmsTraveled };
};

const calculateWeaponDamage = (weapon) => {
  if (!weapon || weapon.quality === 0){
    return 0;
  }
  const damage = Math.ceil((rollDice(weapon.num_die_damage) + weapon.quality) / 5);
  return damage;
};

const calculateTotalDamage = (weaponDamage, dexterity) => {
  return Math.ceil((weaponDamage + dexterity) / 4);
};

const performMageActions = (character, characters) => {
  const roll = rollDice(100);
  if (roll <= character.stats.dexterity) {
    const targetIndex = rollDice(characters.length) - 1;
    const target = characters[targetIndex];

    const weapon = character.equipment.weapons[0];
    const weaponDamage = calculateWeaponDamage(weapon);
    const totalDamage = calculateTotalDamage(weaponDamage, character.stats.dexterity);

    target.stats.strength = Math.max(0, target.stats.strength - totalDamage);

    return {
      action: 'mage_attack',
      attacker: character.name,
      target: target.name,
      weaponDamage,
      totalDamage,
      targetStrengthAfterAttack: target.stats.strength
    };
  } else {
    return {
      action: 'mage_no_damage',
      attacker: character.name
    };
  }
};

const performThugActions = (character, characters) => {
  const targetIndex = rollDice(characters.length) - 1;
  const target = characters[targetIndex];

  const theftType = rollDice(3); 
  let stolenItem;

  if (theftType === 1) {
    stolenItem = 'gold';
    if (target.equipment.pouch.gold > 0) {
      target.equipment.pouch.gold -= 1;
      character.equipment.pouch.gold += 1;
    }
  } else if (theftType === 2) {
    stolenItem = 'coins';
    const coinsToSteal = Math.ceil(target.stats.dexterity / 2);
    if (target.equipment.pouch.coins >= coinsToSteal) {
      target.equipment.pouch.coins -= coinsToSteal;
      character.equipment.pouch.coins += coinsToSteal;
    }
  } else {
    stolenItem = 'arrow';
    if (target.equipment.quiver > 0) {
      target.equipment.quiver -= 1;
      character.equipment.quiver += 1;
    }
  }

  const roll = rollDice(100);
  if (roll <= character.stats.dexterity) {
    const weapon = character.equipment.weapons[0]; 
    const weaponDamage = calculateWeaponDamage(weapon);
    const totalDamage = calculateTotalDamage(weaponDamage, character.stats.dexterity);

    target.stats.strength = Math.max(0, target.stats.strength - totalDamage);

    return {
      action: 'thug_attack',
      stolenItem,
      attacker: character.name,
      target: target.name,
      weaponDamage,
      totalDamage,
      targetStrengthAfterAttack: target.stats.strength
    };
  } else {
    return {
      action: 'thug_no_damage',
      stolenItem,
      attacker: character.name
    };
  }
};

const performPeasantActions = (character, characters) => {
  const targets = characters.filter((c) => c.name !== character.name);
  if (targets.length < 2){
    return { action: 'peasant_no_targets' };
  } 
  const target1 = targets[rollDice(targets.length) - 1];
  let target2;
  do {
    target2 = targets[rollDice(targets.length) - 1];
  } while (target1.name === target2.name);

  const foodItems = character.equipment.saddlebag.splice(0, 2); 

  if (foodItems.length > 0) {
    target1.equipment.saddlebag.push(foodItems[0]);
    if (foodItems[1]) target2.equipment.saddlebag.push(foodItems[1]);
  }

  return {
    action: 'peasant_give_food',
    giver: character.name,
    targets: [target1.name, target2.name],
    foodGiven: foodItems
  };
};

const performJokerActions = (characters) => {
  const randomIndex = rollDice(characters.length) - 1;
  const selectedCharacter = characters[randomIndex];

  return {
    action: 'joker_select',
    selected: selectedCharacter.name,
    message: `${selectedCharacter.name} ha sido seleccionado por el Joker para iniciar las acciones.`
  };
};

const performGamblerActions = (character, characters) => {
  const targets = characters.filter((c) => c.name !== character.name);
  if (targets.length === 0)
    {
        return { action: 'gambler_no_targets' };
    } 

  const targetIndex = rollDice(targets.length) - 1;
  const opponent = targets[targetIndex];
  const coinFlip = rollDice(2) === 1 ? 'cara' : 'cruz';
  const winner = coinFlip === 'cara' ? character : opponent;
  const loser = coinFlip === 'cara' ? opponent : character;

  if (loser.equipment.pouch.precious_stones.length > 0) {
    const preciousStone = loser.equipment.pouch.precious_stones.pop();
    winner.equipment.pouch.precious_stones.push(preciousStone);
  }

  return {
    action: 'gambler_bet',
    winner: winner.name,
    loser: loser.name,
    coinFlip,
    message: `${winner.name} ganó la apuesta contra ${loser.name}.` +
      (loser.equipment.pouch.precious_stones.length > 0 ? ` ${winner.name} recibió una piedra preciosa.` : ` ${loser.name} no tenía piedras preciosas para apostar.`)
  };
};

const performWarriorActions = performMageActions; 

const performCatatoniaActions = (characters) => {
  characters.sort((a, b) => b.stats.dexterity - a.stats.dexterity);

  const results = [];

  characters.forEach((character) => {
    if (character.occupation === 'mage') {
      results.push(performMageActions(character, characters));
    } else if (character.occupation === 'thug') {
      results.push(performThugActions(character, characters));
    } else if (character.occupation === 'peasant') {
      results.push(performPeasantActions(character, characters));
    } else if (character.occupation === 'joker') {
      results.push(performJokerActions(characters));
    } else if (character.occupation === 'gambler') {
      results.push(performGamblerActions(character, characters));
    } else if (character.occupation === 'warrior') {
      results.push(performWarriorActions(character, characters));
    }
  });

  return results;
};

const afternoonCycle = (characters, dayOfWeek) => {
  const results = [];

  // Perdida de stamina
  const staminaLoss = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday' ? 4 : 2;
  characters.forEach((character) => {
    character.stats.stamina = Math.max(0, character.stats.stamina - staminaLoss);
    results.push({
      character: character.name,
      staminaAfterLoss: character.stats.stamina
    });
  });

  // Acciones de catatonía
  const catatoniaResults = performCatatoniaActions(characters);

  return { staminaLoss, results, catatoniaResults };
};

const performNightCycle = (characters) => {
    const results = [];
  
    // Canticos regionales
    const joker = characters.find(c => c.occupation === 'joker');
    if (joker) {
      const songs = [
        "When fire burns within",
        "A side effect of recovery",
        "Freddy Merkury, the real wayward",
        "Pazus, the impassible: from boost to fail"
      ];
      const selectedSong = songs[rollDice(songs.length) - 1];
      results.push({
        action: 'regional_chant',
        performer: joker.name,
        song: selectedSong
      });
    }
  
    // // Recuperación de stamina
    // characters.forEach((character) => {
    //   const { stamina } = character.stats;
    //   if (stamina < 20) {
    //     // Come 2 alimentos si dispone de ellos
    //     const foodItems = character.equipment.saddlebag.splice(0, 2);
    //     foodItems.forEach(food => {
    //       character.stats.stamina += food.recover_stamina;
    //     });
    //     results.push({
    //       action: 'stamina_recovery',
    //       character: character.name,
    //       foodConsumed: foodItems.map(f => f.name),
    //       staminaRecovered: foodItems.reduce((sum, food) => sum + food.recover_stamina, 0)
    //     });
    //   } else if (stamina >= 20 && stamina <= 50) {
    //     // Come 1 alimento si dispone de él
    //     const foodItem = character.equipment.saddlebag.shift();
    //     if (foodItem) {
    //       character.stats.stamina += foodItem.recover_stamina;
    //       results.push({
    //         action: 'stamina_recovery',
    //         character: character.name,
    //         foodConsumed: [foodItem.name],
    //         staminaRecovered: foodItem.recover_stamina
    //       });
    //     }
    //   }else if(foodItems.length === 0) {
    //         results.push({
    //           action: 'stamina_recovery',
    //           character: character.name,
    //           foodConsumed: [],
    //           staminaRecovered: 0
    //         });
    //   }
    // });
  
    // // Calidad de las armas
    // characters.forEach((character) => {
    //   character.equipment.weapons.forEach((weapon) => {
    //     if (weapon.type === 'common') {
    //       weapon.quality = Math.max(0, weapon.quality - 1);
    //     } else if (weapon.type === 'arcane') {
    //       weapon.quality = Math.min(50, weapon.quality + 1);
    //     }
    //     results.push({
    //       action: 'weapon_quality_change',
    //       character: character.name,
    //       weapon: weapon.name,
    //       newQuality: weapon.quality
    //     });
    //   });
    // });
  
    // // Sanacion
    // const priest = characters.find(c => c.occupation === 'priest');
    // if (priest) {
    //   characters.forEach((character) => {
    //     const healing = rollDice(3);
    //     character.stats.strength += healing;
    //     results.push({
    //       action: 'healing',
    //       healer: priest.name,
    //       target: character.name,
    //       healingPoints: healing
    //     });
    //   });
    // }
  
    // Descanso
    results.push({ action: 'rest', message: 'El equipo descansa hasta la mañana siguiente.' });
  
    return results;
  };
  
  const performDatabaseUpdate = async (characters, timeRecord) => {
    // Registrar cambios en personajes
    for (const character of characters) {
      await character.save();
    }
  
    // Registrar datos de tiempo y kilometraje
    const timeModel = require('./src/models/Time');
    const newTimeRecord = new timeModel(timeRecord);
    await newTimeRecord.save();
  
    return { message: 'Base de datos actualizada.' };
  };

  module.exports = { rollDice, morningCycle, middayCycle, afternoonCycle, performNightCycle, performDatabaseUpdate };




