const utilCreep = require('util.creep');

const roleRefiller = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.transporting && creep.carry.energy == 0) {
        creep.say('reload');
        creep.memory.transporting = false;
    } else if (!creep.memory.transporting && creep.carry.energy == creep.carryCapacity) {
        creep.memory.transporting = true;
        creep.say('fill');
    }


    if (creep.memory.transporting) {
      const structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: structure => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity
      });

      if(structure != undefined) {
          if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
          } else {
              creep.moveTo(31,33);
          }
      } 
    } else {
        utilCreep.getEnergy(creep, true, false, false); // getEnergy(creep, useStorage, useContainer, useSource)
    }
      
  },
  spawn: function(availEnergy) {
      let newName = 'Refiller' + Game.time;
      const refillerBody = utilCreep.createTransportBody(availEnergy);
      Game.spawns['Spawn1'].spawnCreep(refillerBody, newName, {memory: {role: 'refiller', transporting: false}});
  }
};

module.exports = roleRefiller;