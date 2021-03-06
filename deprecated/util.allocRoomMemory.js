function allocRoomMemory(room){
        let roomMem = room.memory;
        if (roomMem.sourceAlloc == null){
            roomMem.sourceAlloc = [0, 0, 0, 0];
        }
        if (roomMem.beCommit == null){
            roomMem.beCommit = 0;
        }
        if (roomMem.heCommit == null){
            roomMem.heCommit = 0;
        }
        if (roomMem.rpCommit == null){
            roomMem.rpCommit = 0;
        }
        getRoomSourceOpenSpaceArray(room);

    roomMem.updateRoomMemorySettings = false;
}

function getRoomSourceOpenSpaceArray(room){
    let sources = room.find(FIND_SOURCES);
    let sourceSlots = []
    for (let i = 0; i < sources.length; i++){
        let val = checkSourceSlots(sources[i]);
        sourceSlots[i] = val;
    }
    room.memory.maxSpotsPerSource = sourceSlots;
}

function checkSourceSlots(source){
    // Establish where to look
    // Establish where to look
    const area = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x -1,
        source.pos.y + 1,
        source.pos.x + 1
    );
    const keys = Object.keys(area);
    let count = 0;
    // Scan the area for Plains or Marsh tiles
    for (let i = 0; i < keys.length; i++) {
        let item = area[keys[i]];
        let k = Object.keys(item);
        for (let j = 0; j < k.length; j++) {
            if (item[k[j]] == 'plain' || item[k[j]] == 'marsh'){
                count++;
            }
        }
    }
    return count;
}

module.exports = {
    allocRoomMemory
}