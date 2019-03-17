const utilCreep = {
    getEnergy: function(creep, useStorage, useContainer, useSource) {
        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        let source;
        if (useSource) {
            source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        } else {
            source = undefined;
        }
        
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => ((useContainer && structure.structureType == STRUCTURE_CONTAINER) || useStorage && (structure.structureType == STRUCTURE_STORAGE)) && structure.store[RESOURCE_ENERGY] > 100
        });
        
        if (droppedEnergy != undefined) {
            if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (container != undefined) {
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (source != undefined){
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } 
    },
    createCustomBody: function(energy) {
        // use only 70% of available power for new creep (more sustainable)
        let numOfParts =  Math.floor(energy*0.7 / (2*100)); // WORK is the heaviest part with 100 cost. Division by two is to allow 1 CARRY and 1 MOVE part for each WORK
        numOfParts = Math.min(numOfParts, Math.floor(50/3)); // Max. num. of allowed parts is 50
        const body = [];

        for (let i = 0; i<numOfParts; i++) {
            body.push(WORK);
        }

        for (let i = 0; i<numOfParts; i++) {
            body.push(CARRY);
        }

        for (let i = 0; i<numOfParts; i++) {
            body.push(MOVE);
        }
        
        return body;
    },
    createMinerBody: function() {
        return [WORK, WORK, WORK, WORK, WORK, MOVE];
    },
    createTransportBody: function(energy) {
        let numOfParts =  Math.floor(energy*0.7 / (2*50)); // this role contains only CARRY and MOVE parts which cost 50
        numOfParts = Math.min(numOfParts, Math.floor(50/2)); // Max. num. of allowed parts is 50
        const body = [];
        
        for (let i = 0; i<numOfParts; i++) {
            body.push(CARRY);
        }

        for (let i = 0; i<numOfParts; i++) {
            body.push(MOVE);
        }
        
        return body;
    }
};

module.exports = utilCreep;