const { rollDice, morningCycle, middayCycle, afternoonCycle, performNightCycle } = require('../../gameLogic');

describe('Game Logic Tests', () => {
  let characters;
  let foodItems;

  beforeEach(() => {

    characters = [
      {
        name: 'Eryndor the Valiant',
        occupation: 'warrior',
        stats: { strength: 10, dexterity: 5, stamina: 30 },
        equipment: {
          saddlebag: [],
          quiver: 5,
          weapons: [{ name: 'Bladesong Sword', num_die_damage: 3, type: 'common', quality: 20 }],
          pouch: { coins: 50, gold: 2, precious_stones: [] },
        },
      },
      {
        name: 'Lyssandra the Mystic',
        occupation: 'mage',
        stats: { strength: 5, dexterity: 10, stamina: 20 },
        equipment: {
          saddlebag: [],
          quiver: 0,
          weapons: [{ name: 'Eclipse Wand', num_die_damage: 4, type: 'arcane', quality: 25 }],
          pouch: { coins: 30, gold: 1, precious_stones: [] },
        },
      },
    ];

    foodItems = [
      { name: 'Silverfin Trout', recover_stamina: 3 },
      { name: 'Goldenleaf Herb', recover_stamina: 2 },
    ];
  });

  test('rollDice genera un número dentro del rango esperado', () => {
    for (let i = 0; i < 100; i++) {
      const roll = rollDice(10);
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(10);
    }
  });

  test('rollDice nunca devuelve un valor fuera del rango', () => {
    const sides = 6; 
    for (let i = 0; i < 100; i++) { 
      const result = rollDice(sides);
      expect(result).toBeGreaterThanOrEqual(1); 
      expect(result).toBeLessThanOrEqual(sides); 
    }
  });
  
  test('morningCycle recompensa correctamente a los personajes', () => {
    const results = morningCycle(characters, foodItems);
    expect(results).toHaveLength(2); 
    results.forEach((result, index) => {
      const character = characters[index];
      expect(result.character).toBe(character.name);
      expect(character.stats.dexterity).toBeGreaterThan(5); 
    });
  });

  test('middayCycle el ciclo avanza el número correcto de kilómetros', () => {
    const team = { kmTotal: 0 };
    const result = middayCycle(team);
    expect(result.kmsTraveled).toBeGreaterThanOrEqual(1);
    expect(result.kmsTraveled).toBeLessThanOrEqual(10);
    expect(team.kmTotal).toBe(result.kmsTraveled);
  });

  test('afternoonCycle reduce la resistencia en función del día de la semana', () => {
    const dayOfWeek = 'Monday';
    const result = afternoonCycle(characters, dayOfWeek);
    result.results.forEach((res, index) => {
      const character = characters[index];
      expect(character.stats.stamina).toBeLessThanOrEqual(30);
    });
  });

  test('performNightCycle procesos cantos regionales', () => {
    characters.push({
      name: 'Kara the Swift',
      occupation: 'joker',
      stats: { strength: 8, dexterity: 15, stamina: 25 },
      equipment: { saddlebag: [], quiver: 0, weapons: [], pouch: { coins: 0, gold: 0, precious_stones: [] } },
    });

    const results = performNightCycle(characters);
    const chantResult = results.find(res => res.action === 'regional_chant');
    expect(chantResult).toBeDefined();
    expect(chantResult.performer).toBe('Kara the Swift');
    expect(chantResult.song).toBeDefined();
  });
 
});
