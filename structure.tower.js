const structureTower = {
    defendRoom: function(roomName, hostile) {
        const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostile));
    },
    healCreep: function(roomName, creep) {
       const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
       towers.forEach(tower => {
           if (tower.energy > 0.5*tower.energyCapacity) { // if tower energy drops bellow 50% capacity stop healing
               tower.heal(creep);
           }
       }); 
    },
    repairStructure: function(roomName, structure) {
       const towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
       towers.forEach(tower => {
           if (tower.energy > 0.5*tower.energyCapacity) { // if tower energy drops bellow 50% capacity stop repairing
               tower.repair(structure)
           }
       }); 
    }
};

module.exports = structureTower;