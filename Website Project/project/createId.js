function generateID(type) {
    let time = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        time += performance.now();
    }
    return type.concat('-xxx-xxx-xxx'.replace(/x/g, function(c){
        let random = (time + Math.random() * 16) % 16 | 0;
        time = Math.floor(time/16);
        return(random.toString(16));
    }));
}

module.exports = {generateID};