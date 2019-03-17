const utilCreep = require('util.creep');

const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            utilCreep.getEnergy(creep, true, false, false); // getEnergy(creep, useStorage, useContainer, useSource)
        }
	},
	spawn: function(availEnergy) {
	    let newName = 'Upgrader' + Game.time;
	    const upgraderBody = utilCreep.createCustomBody(availEnergy);
	    Game.spawns['Spawn1'].spawnCreep(upgraderBody, newName, {memory: {role: 'upgrader', upgrading: false}});    
	}
};

module.exports = roleUpgrader;