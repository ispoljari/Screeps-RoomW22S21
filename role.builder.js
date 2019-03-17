const roleUpgrader = require('role.upgrader');
const utilCreep = require('util.creep');

const roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
              creep.memory.building = false;
              creep.say('reload');
        }
        
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }
        
        if(creep.memory.building) {
            const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target != undefined ) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
        else {
            utilCreep.getEnergy(creep, true, false, false); // getEnergy(creep, useStorage, useContainer, useSource)
        }
  },
  spawn: function(availEnergy) {
      let newName = 'Builder' + Game.time;
      const builderBody = utilCreep.createCustomBody(availEnergy);
      Game.spawns['Spawn1'].spawnCreep(builderBody, newName, {memory: {role: 'builder', building: false}});    
  }
};

module.exports = roleBuilder;