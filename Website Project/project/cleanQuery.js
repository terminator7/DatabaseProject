function cleanName(string) {
    console.log(string);
    return string.charAt(0).toUpperCase() + (string.slice(1)).toLowerCase();
}

module.exports = {cleanName};