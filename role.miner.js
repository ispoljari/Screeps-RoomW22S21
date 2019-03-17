const utilCreep = require('util.creep');

const roleMiner = {
  run: function(creep) {
      const source = Game.getObjectById(creep.memory.sourceId);
      const container = source.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: structure => structure.structureType == STRUCTURE_CONTAINER
      })[0];

      if (creep.pos.isEqualTo(container.pos)){
          creep.harvest(source);
      } else {
          creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}})
      }
  },
  spawn: function() {
      let newName = 'Miner' + Game.time;
      const availableSources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
      const existingMiners = _.filter(Game.creeps, creep => creep.memory.role == 'miner');

      // this code is intended to distribute only two miners, each to a separate of the two power sources in the room
      let id; 
      if (existingMiners.length == 0) {
          id = availableSources[0].id;
      } else {
          const freeSources = _.filter(availableSources, source => source.id != existingMiners[0].memory.sourceId);
          id = freeSources[0].id;
      }
      
      const minerBody = utilCreep.createMinerBody();
      Game.spawns['Spawn1'].spawnCreep(minerBody, newName, {memory: {role: 'miner', sourceId: id}});    
  } 
};

module.exports = roleMiner;