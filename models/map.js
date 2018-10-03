const Map = function () {

    const args = Array.prototype.slice.call(arguments);
    const $a = args[0] || {};

    Object.defineProperties(this,{
        'teams': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': $a['teams'] || 2,
        },
        'size': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': $a['size'] || []
        },
        'offset': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': $a['offset'] || []
        },
        'dim': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': 2
        },
        'cells': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': $a['cells'] || []
        },
    });

    const map = this;

    this.cells.forEach( (cell,index) => {
        Object.defineProperties(cell, {
            'coordinates': {
                'enumerable': true,
                'configurable': false,
                'get': () => [ Math.floor(index / map.size[1]),  index % map.size[1]]
            }
        });
    })

};

Object.defineProperties(Map, {
    'directions': {
        'enumerable': true,
        'configurable': false,
        'get': () => ({
            'north': 0,
            'east': 1,
            'south': 2,
            'west': 3,
        })
    }
})

Object.defineProperties(Map.prototype,{
    'getCellIndex': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (i, j) {
            return (i - this.offset[0])*this.size[1] + (j - this.offset[1])
        }
    },
    'getCellCoordinates': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (targetCell) {

            return typeof targetCell === 'number' ? this.cells[targetCell].coordinates : targetCell.coordinates;

            /*
            const index = typeof targetCell === 'number' ?
                    targetCell
                 :
                    this.cells.findIndex(cell => cell === targetCell)
                ;

            return ( index < 0 || index >= this.size[0]*this.size[1] ) ? null : [ Math.floor(index / this.size[0]),  index % this.size[0]];
            */
        }
    },
    'getCell': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (i, j = null) {
            if (j === null && typeof i === 'number') {
                return this.cells[i]
            } else if (j === null && Array.isArray(i)) {
                return this.getCell(i[0],i[1]);
            }

            if ( i < this.offset[0] || i >= this.offset[0] + this.size[0] || j < this.offset[1] || j >= this.offset[1] + this.size[1]) {
                return null;
            }

            return this.cells[this.getCellIndex(i,j)];
        }
    },
    'getUnitCellIndex': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit) {
            const index = this.cells.findIndex(cell => cell.unit && (cell.unit === unit));
            return index < 0 ? null : index;
        },
    },

    'getUnitCell': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit) {
            const index = this.getUnitCellIndex(unit);
            return index === null ? null : this.cells[index];
        },
    },

    'getAdjacent': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (cell) {
            const coordinates = this.getCellCoordinates(cell);

            const cells = new Set();

            if (coordinates[0] > 0) {
                cells.add( this.getCell(coordinates[0]-1,coordinates[1]) );
            }

            if (coordinates[0] < this.size[0] - 1) {
                cells.add( this.getCell(coordinates[0]+1,coordinates[1]) );
            }

            if (coordinates[1] > 0) {
                cells.add( this.getCell(coordinates[0],coordinates[1]-1) );
            }

            if (coordinates[1] < this.size[1] - 1) {
                cells.add( this.getCell(coordinates[0],coordinates[1]+1) );
            }


            return cells;

        },
    },

    'go': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (cell, direction) {
            const coordinates = this.getCellCoordinates(cell);

            if (Map.directions.north === direction && coordinates[0] > 0) {
                return this.getCell(coordinates[0]-1,coordinates[1]);
            }

            if (Map.directions.south === direction < this.size[0] - 1) {
                return this.getCell(coordinates[0]+1,coordinates[1]);
            }

            if (Map.directions.west === direction && coordinates[1] > 0) {
                return this.getCell(coordinates[0],coordinates[1]-1);
            }

            if (Map.directions.east === direction && coordinates[1] < this.size[1] - 1) {
                return this.getCell(coordinates[0],coordinates[1]+1);
            }

            return null;

        },
    },

    'json': {
        'enumerable': true,
        'configurable': false,
        'get': function () {
            return {
                teams: this.teams,
                size: this.size,
                offset: this.offset,
                cells: this.cells.map( cell => {
                   const cell_data = {
                       terrain: cell.terrain.type,
                   };

                   if (cell.unit) {
                       cell_data.unit = {
                           owner: cell_data.unit.owner.name,
                           unit: cell_data.unit.type,
                       }
                   }

                   return cell_data;
                }),
            }
        },
    },

    'build': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function ( data ) {

            const {terrains, units} = data;

            this.cells.forEach( cell => {
                if ( !(cell.terrain in terrains)) {
                    console.error(`Terrain type '${cell.terrain}' does not exists`);
                    return;
                }
                cell.terrain = terrains[cell.terrain];

                if (cell.unit && cell.unit !== null) {
                    cell.unit.type = units[cell.unit.type];
                }
            });

            return this;
        },
    },
});

module.exports = Map;