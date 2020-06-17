const basicUtiltyBuild = [WORK, CARRY, MOVE]; // 200 points, "Bub" :D
const basicUtiltyBuildmkII = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 550 points
const defenderMKi = [ATTACK, ATTACK, MOVE, MOVE]; // 300 points
var numBUBCreeps;
var numBUBmkiiCreeps;
    
function spawnerLogic(spawn){
    let isSpawning = spawn.spawning == false;  

    if(!isSpawning){
        getCreepsInRoom(spawn)
        //General population level maintinance, based on energy

        if(numBUBCreeps < (spawn.room.energyCapacityAvailable / 50) && spawn.room.energyCapacityAvailable < 550 && spawn.room.energyAvailable >= 200){ // 200 point BUBs
            spawnBUB(spawn);
            return;
        }
        else if (((numBUBmkiiCreeps * 3) + numBUBCreeps) < (spawn.room.energyCapacityAvailable / 50) && spawn.room.energyCapacityAvailable >= 550 && spawn.room.energyAvailable >= 550){ // 550 point BUBs
            spawnBUBmkII(spawn);
            return;
        }

        // Address shortfalls
        
        let adjNeed = getEnergyNeed(spawn);


        if (adjNeed > 300 && spawn.room.energyAvailable > 500){
            spawnBUBmkII(spawn);  
            return;
        }
        else if (adjNeed > 150 && spawn.room.energyAvailable >=300){
            spawnBUB(spawn)    
            return;        
        }
        else if (spawn.room.find(FIND_MY_CREEPS).length === 0 && spawn.room.energyAvailable === 200){
            spawnBUB(spawn);
            return;
        } 
    }     
    
}

module.exports = {
    spawnerLogic
}

function spawnBUB(spawn){
    let newName = 'BUB_' + Game.time;
    let selectedBuild = basicUtiltyBuild;
    let memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
    spawn.spawnCreep(selectedBuild, newName, memoryOptions);
}

function spawnBUBmkII(spawn){
    let newName = 'BUB_mkII_' + Game.time;
    let selectedBuild = basicUtiltyBuildmkII;
    let memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUBmkII'}};
    spawn.spawnCreep(selectedBuild, newName, memoryOptions)        
}

function getEnergyNeed(spawn){
    // Energy collection need
    let hNeed = (spawn.room.energyAvailable + Memory.heCommit - spawn.room.energyCapacityAvailable);
    //Build need
    let bNeed = 0;
    let sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
    for(let c in sites){bNeed += sites[c].progressTotal - sites[c].progress};
    if(isNaN(bNeed)){bNeed = 0}
    // Repair need
    let rNeed = 0;
    let structs = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType != STRUCTURE_CONTROLLER)
    }});
    for(let s in structs){rNeed += structs[s].hitsMax - structs[s].hits};
    // Work cap of BUBs
    let bubEngCap = (numBUBCreeps + (numBUBmkiiCreeps * 3) ) * 50;

    return (hNeed + bNeed + rNeed) - bubEngCap;
}

function getCreepsInRoom(spawn){
    console.log("Spawn: " + spawn);
    creeps = spawn.room.find(FIND_MY_CREEPS);
    console.log("Creeps: " + JSON.stringify(creeps));
    if (creeps.length > 0){
        numBUBCreeps = 0;
        numBUBmkiiCreeps = 0;
        for (let c in creeps){
            type = creeps[c].buildType;
            switch (type){
                case 'BUB':
                    numBUBCreeps++;
                    break;
                case 'BUBmkII':
                    numBUBmkiiCreeps++;
                    break;
                default:
                    console.log(creeps[c] + " is of an unknown Buildtype");
            }
        }
    }
}
