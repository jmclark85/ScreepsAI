const maxSpotsPerSource = [3, 3, 0, 1];
var numAllocated = [0, 0, 0, 0];
var sourceCounter = 0;
var nextSource = 0;

function reserveSpot(){
    let index = null;
    let m = maxSpotsPerSource[i];
    let n = numAllocated[i];
    let lON = 0;
    let lOS = 0; // "Least objectionable solution"
    for (let i = 0; i < maxSpotsPerSource.length; i++){
        
        if (n < m){ // If there is an open spot.
            index = i;
            break;
        }
        else{
            let test = m / (n + 1); // Basic test for how overcrowded any particular spot would be (predictive-ish), the closer to 1 the less overcrowded
            // The +1 is to bias towards sources that have more openings. 
            // It is easier for a source with 6 slots to accept a 7th, the a source with 1 to accept a 2nd... I think.
            if(lON < test){
                lON = test;
                lOS = i;
            }
        }
    }
    if (index){
        numAllocated[index]++
        return index;
    }
    else{
        numAllocated[index]++
        return lOS;
    }
}

var getEnergy = {
    /** @param {Creep} creep **/
    run: function(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        if(creep.store.getFreeCapacity() > 0){
            if (creep.memory.targetSource == null){
                let targetIndex = reserveSpot();
                creep.memory.targetSourceIndex = targetIndex;
            }
            let target = sources[creep.memory.targetSourceIndex];
            if(creep.harvest(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        if(creep.store.getFreeCapacity === 0){
            creep.memory.harvesting = false;
            creep.memory.targetSource = null;
            numAllocated[creep.memory.targetSourceIndex]--;
            creep.memory.targetSourceIndex = null;
        }

    }
}

module.exports = getEnergy;
// I need to find a good way to programmatically determine how many free spots are next to any given source
// to make this code generalisable.