const utilCreep = require('util.creep');

const roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.harvesting && creep.carry.energy == 0) {
      creep.memory.harvesting = false;
      creep.say('harvest');
    } else if (!creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
      creep.memory.harvesting = true;
      creep.say('fill');
    }

    if (creep.memory.harvesting) {
      const structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: structure => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity
      });
      
      const constructedStorage = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_STORAGE});
      
      if (structure == undefined && constructedStorage.length > 0) {
          structure = creep.room.storage;
      }

      if(structure != undefined) {
          if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
          }
      } else {
          creep.moveTo(22,40);
      } 
    } else {
        utilCreep.getEnergy(creep, false, true, true); // getEnergy(creep, useStorage, useContainer, useSource)
    }
      
  },
  spawn: function(availEnergy) {
      let newName = 'Harvester' + Game.time;
      const harvesterBody = utilCreep.createCustomBody(availEnergy);
      Game.spawns['Spawn1'].spawnCreep(harvesterBody, newName, {memory: {role: 'harvester', harvesting: false}});
  }
};

module.exports = roleHarvester;