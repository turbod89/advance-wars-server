const fs = require('fs');

const createJson = function (data) {
    const {size,units} = data;
    const charMap = data.charMap.replace(/\n/g,'');
    const charUnits = data.charUnits.replace(/\n/g,'');

    const cells = [];
    for (let i =0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
            if (charMap[ i * size[1] + j] === '.') {
                cells.push({
                    terrain: 'Plain',
                })
            } else if (charMap[ i * size[1] + j] === '~') {
                cells.push({
                    terrain: 'River',
                })
            } else if (charMap[ i * size[1] + j] === '"') {
                cells.push({
                    terrain: 'Wood',
                })
            } else if (charMap[ i * size[1] + j] === 'M') {
                cells.push({
                    terrain: 'Mountain',
                })
            } else if (charMap[ i * size[1] + j] === '=') {
                cells.push({
                    terrain: 'Road',
                })
            } else if (charMap[ i * size[1] + j] === '%') {
                cells.push({
                    terrain: 'Bridge',
                })
            } else {
                cells.push({
                    terrain: 'Plain',
                })
            }
        }
    }

    let unit_cnt = 0;
    for (let i =0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
            const index = '0123456789'.split('').findIndex( c => c === charUnits[ i * size[1] + j]);
            if (index >= 0 ) {
                cells[i *size[1]+ j]['unit'] = {
                    team: index,
                    type: units[unit_cnt],
                };
                unit_cnt++;
            }
        }
    }

    return {
        "teams": 2,
        size,
        "offset": [0,0],
        cells,
    };
};

//const data = require('../data/map2.scheme');
//console.log(JSON.stringify(createJson(data)));

const folder = './data/';
const files = fs.readdirSync(folder);
files.forEach (file => {
   if (/map\d+\.scheme\.js/.test(file)) {
       targetFilename = file.replace(/(map\d+)\.scheme.+/,'$1.json');
       const data = require('../data/' + file);
       fs.writeFileSync(folder + targetFilename, JSON.stringify(createJson(data)), err => {
           if (err) {
               console.error(`Error writing file '${targetFilename}':`,err);
           } else {
               console.log(`Succesfully written file '${targetFilename}.`);
           }

       });
   }
});
