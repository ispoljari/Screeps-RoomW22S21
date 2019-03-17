const roleUpgrader = require('role.upgrader');
const utilCreep = require('util.creep');

const roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('reload');
        } else if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('repair');
        }
        
	    
        if (creep.memory.repairing) {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
            });

            if(target != undefined) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                roleUpgrader.run(creep); // if there are no repair jobs assume the role of upgrader
            }
        } else {
            utilCreep.getEnergy(creep, true, false, false); // getEnergy(creep, useStorage, useContainer, useSource)
        }
	},
	spawn: function(availEnergy) {
	    let newName = 'Repairer' + Game.time;
	    const repairerBody = utilCreep.createCustomBody(availEnergy);
	    Game.spawns['Spawn1'].spawnCreep(repairerBody, newName, {memory: {role: 'repairer', repairing: false}});    
	}
};

module.exports = roleRepairer;