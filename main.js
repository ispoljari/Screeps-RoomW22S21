const roleHarvester = require('role.harvester'); // harvests energy from source and container, transfers energy to every construction (builds only when all other creeps are dead)
const roleTruck = require('role.truck'); // withdraws energy from container, transfers energy to storage
const roleRefiller = require('role.refiller'); // withdraws energy from storage, transfers energy to every other construction
const roleUpgrader = require('role.upgrader'); // withdraws energy from storage, transfers energy to controller
const roleBuilder = require('role.builder'); // withdraws energy from storage, transfers energy to construction sites
const roleRepairer = require('role.repairer'); // withdraws energy from storage, transfers energy to broken constructions
const roleMiner = require('role.miner'); // mines energy from source, drops it into container
const structureTower = require('structure.tower');
const utilMemory = require('util.memory');

module.exports.loop = function () {
    utilMemory.deleteDeadCreeps(); // delete dead creeps from memory
    
    // logic for controling the number of creeps with diff roles on the map
    // --------
    const availEnergy = Game.spawns['Spawn1'].room.energyAvailable;
    
    // if there is at least 1 container, spawn 1 miner. 
    const containersConstructed = Game.spawns.Spawn1.room.find(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_CONTAINER});
    const miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    if ((containersConstructed.length == 1 && miners.length < 1) || (containersConstructed.length == 2 && miners.length < 2)) {
        if (availEnergy >= 550) {
            roleMiner.spawn();       
        }
    } 
    
    // if there is at least 1 miner, and a storage, spawn two trucks
    const storageConstructed = Game.spawns.Spawn1.room.find(FIND_STRUCTURES,{filter: structure => structure.structureType == STRUCTURE_STORAGE});
    const trucks = _.filter(Game.creeps, (creep) => creep.memory.role == 'truck');
    if(((trucks.length < 3 && miners.length == 1) || (trucks.length < 5 && miners.length == 2)) && storageConstructed.length > 0) {
        if (availEnergy >= 100) {
            roleTruck.spawn(availEnergy);       
        } 
    }
    
     // if there is at least 1 truck, spawn two refillers
    const refillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'refiller');
    if(refillers.length < 2 && trucks.length > 0) {
        if (availEnergy >= 100) {
            roleRefiller.spawn(availEnergy);       
        } 
    }
    
    // if there are no trucks or no refillers or no miners, spawn 3 harvesters
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    if(harvesters.length < 3 && (trucks.length < 1 || refillers.length < 1 || miners.length < 1)) {
        if (availEnergy >= 200) {
            roleHarvester.spawn(availEnergy);       
        } 
    }
    
    // if there is at least 1 harvester or truck, spawn upgrader
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    if(upgraders.length < 3 && (harvesters.length>0 || trucks.length>0)) {
        if (availEnergy >= 200) {
            roleUpgrader.spawn(availEnergy);   
        }
    }
    
    // if there is at least 1 harvester or truck, and a construction site, spawn builder
    const sitesInConstruction =  Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES);
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if(builders.length < 2 && (harvesters.length>1 || trucks.length>1) && (sitesInConstruction.length > 0)) {
        if (availEnergy >= 200) {
            roleBuilder.spawn(availEnergy);    
        }
    }
    
    // if there is at least 1 harvester or truck, and a building that needs repair, spawn repairer
    const damagedBuildings = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
    });
    const repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    if(repairers.length < 1 && (harvesters.length > 0 || trucks.length > 0) && (damagedBuildings.length > 0)) {
        if (availEnergy >= 200) {
            roleRepairer.spawn(availEnergy);
        }
    }
    
    // --------
    // Assign tasks to creeps based on their roles
    
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        
         if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        
        if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        
        if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        
        if (creep.memory.role == 'truck') {
            roleTruck.run(creep);
        }
        
        if (creep.memory.role == 'refiller') {
            roleRefiller.run(creep);
        }
    }
    
    // --------
    // Setup tower defense logic
    
     const towersConstructed = Game.spawns.Spawn1.room.find(FIND_STRUCTURES,
       {filter: structure => structure.structureType == STRUCTURE_TOWER});
     const hostiles = Game.rooms['W22S21'].find(FIND_HOSTILE_CREEPS); 
     
     structureTower.defendRoom('W22S21');
     
    // --------
    // If there are no towers or an enemy creep is detected, activate safe mode
       
    if (towersConstructed.length < 1 || hostiles.length > 0) {
       Game.rooms['W22S21'].controller.activateSafeMode(); 
    };
    
    // --------
    // If any of the existing towers are destroyed this will automatically place new construction sites on the old places place
    
    if (Game.spawns.Spawn1.room.controller.level >= 3) {
        const towersConstructed = Game.spawns.Spawn1.room.find(FIND_STRUCTURES,
            {filter: structure => structure.structureType == STRUCTURE_TOWER});
        if(towersConstructed.length < 2) {
            Game.rooms['W22S21'].createConstructionSite(23, 34, STRUCTURE_TOWER);
            Game.rooms['W22S21'].createConstructionSite(29, 32, STRUCTURE_TOWER);
        }
    } 
    
    // --------
    // If storage is destroyed, this will automatically place a new construction site on it's place
    
    if (Game.spawns.Spawn1.room.controller.level >= 4) {
        const storageConstructed = Game.spawns.Spawn1.room.find(FIND_STRUCTURES,
            {filter: structure => structure.structureType == STRUCTURE_STORAGE});
        if(storageConstructed.length < 1) {
            Game.rooms['W22S21'].createConstructionSite(29, 30, STRUCTURE_STORAGE); 
        }
    } 
    
    // If any of the existing extensions or containers are destroyed this will automatically place new construction sites on the old positions
     
    if (Game.spawns.Spawn1.room.controller.level > 2) {
        const extensionsConstructed = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_EXTENSION});
        const containersConstructed = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType == STRUCTURE_CONTAINER});

        if(extensionsConstructed.length < 16) { // this should be refactored to enable automatic placement and growth of extensions
            const extensionCoordinates = {
                s1: [23,32],
                s2: [24,32],
                s3: [26,32],
                s4: [27,32],
                s5: [23,33],
                s6: [24,33],
                s7: [25,33],
                s8: [26,33],
                s9: [27,33],
                s10: [24,34],
                s11: [26,34],
                s12: [27,34],
                s13: [24,36],
                s14: [25,36],
                s15: [26,36]
            };
            
            for (let step in extensionCoordinates) {
                Game.rooms['W22S21'].createConstructionSite(extensionCoordinates[step][0], extensionCoordinates[step][1], STRUCTURE_EXTENSION); 
            }
            
        } else if (containersConstructed.length < 2) {
            Game.rooms['W22S21'].createConstructionSite(22, 27, STRUCTURE_CONTAINER); 
            Game.rooms['W22S21'].createConstructionSite(27, 41, STRUCTURE_CONTAINER); 
        }
    }
}