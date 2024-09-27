const { map } = require("./config/map");

//console.log(map)

map.forEach(element => {
    console.log(element[0]+ "|"+ element[2])
});

