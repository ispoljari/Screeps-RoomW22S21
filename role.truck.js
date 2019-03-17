const utilCreep = require('util.creep');

const roleTruck = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.transporting && creep.carry.energy == 0) {
      creep.memory.transporting = false;
      creep.say('reload');
    } else if (!creep.memory.transporting && creep.carry.energy == creep.carryCapacity) {
      creep.memory.transporting = true;
      creep.say('store');
    }

    if (creep.memory.transporting) {
      const structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_STORAGE});
        
        
      if(structure != undefined) {
          if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
          }
      } else {
          creep.moveTo(18,29);
      } 
    } else {
        utilCreep.getEnergy(creep, false, true, false); // getEnergy(creep, useStorage, useContainer, useSource)
    }
      
  },
  spawn: function(availEnergy) {
      let newName = 'Truck' + Game.time;
      const truckBody = utilCreep.createTransportBody(availEnergy);
      Game.spawns['Spawn1'].spawnCreep(truckBody, newName, {memory: {role: 'truck', transporting: false}});
  }
};

module.exports = roleTruck;