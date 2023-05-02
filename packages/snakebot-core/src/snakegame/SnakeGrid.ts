import { Chance } from 'chance'
import _ from 'lodash'

export type TileCoords = [row: number, column: number]

export type Tile = 'head' | 'segment' | 'tail' | 'apple' | 'wall' | 'empty'

export type SnakeDirection = 'up' | 'down' | 'left' | 'right'
const directions: SnakeDirection[] = ['up', 'down', 'left', 'right']

export type GridContents = {
    segmentCoords: TileCoords[]
    headCoords: TileCoords
    tailCoords: TileCoords
    appleCoords: TileCoords
    direction: SnakeDirection
    points: number
}

export type SnakeMoveResult = 'u won' | 'u died' | 'u survived'

// each of these corresponds to a tile on an 8x8 grid
const tileCharMapWidth = 8
const tileCharMap =
    'zxcvbnm,' + 'asdfghjk' + 'qwertyui' + '12345678' + 'ZXCVBNM<' + 'ASDFGHJK' + 'QWERTYUI' + '!@#$%^&*'

/**
 * Convert a tile coordinate to a character from the {@link tileCharMap}.
 */
function stringifyCoords(c: TileCoords): string {
    return tileCharMap[c[0] * tileCharMapWidth + c[1]]
}

/**
 * Convert  character from the {@link tileCharMap} to a tile coordinate.
 */
function unstringifyCoords(c: string): TileCoords {
    const index = tileCharMap.indexOf(c)
    const row = Math.floor(index / tileCharMapWidth)
    const column = index % tileCharMapWidth
    return [row, column]
}

export class SnakeGrid implements GridContents {
    readonly columnCount = 8
    readonly rowCount = 5

    points: number
    segmentCoords: TileCoords[]
    headCoords: TileCoords
    tailCoords: TileCoords
    appleCoords: TileCoords
    direction: SnakeDirection

    constructor(from: SnakeGrid | GridContents) {
        const copy = _.cloneDeep(from) as GridContents

        this.segmentCoords = copy.segmentCoords
        this.headCoords = copy.headCoords
        this.tailCoords = copy.tailCoords
        this.appleCoords = copy.appleCoords
        this.direction = copy.direction
        this.points = copy.points
    }

    static makeDefault(): SnakeGrid {
        const grid = new SnakeGrid({
            appleCoords: [0, 0],
            headCoords: [2, 2],
            segmentCoords: [[2, 3]],
            tailCoords: [2, 4],
            direction: 'left',
            points: 0,
        })

        grid.moveApple()
        return grid
    }

    /**
     * Create a string containing the points, the direction,
     * and the coordinates of each segment in order.
     */
    stringify(): string {
        let result = ''
        result += `${this.points}/`
        result += directions.indexOf(this.direction)
        result += '/'
        result += stringifyCoords(this.appleCoords)
        result += stringifyCoords(this.headCoords)
        this.segmentCoords.forEach(c => (result += stringifyCoords(c)))
        result += stringifyCoords(this.tailCoords)

        return result
    }

    /**
     * Create a {@link SnakeGrid} from the given string.
     */
    static unstringify(from: string): SnakeGrid {
        const s = from.split('/')
        const points = Number(s[0])
        const direction = directions[Number(s[1])]

        const segmentCoords = Array.from(s[2]).map(c => unstringifyCoords(c))
        const appleCoords = segmentCoords.shift()!
        const headCoords = segmentCoords.shift()!
        const tailCoords = segmentCoords.pop()!

        return new SnakeGrid({ appleCoords, headCoords, tailCoords, segmentCoords, points, direction })
    }

    /**
     * Get the tile at the given coordinates.
     */
    tileAt(segmentCoords: TileCoords): Tile
    tileAt(row: number, column: number): Tile
    tileAt(rowOrCoords: number | TileCoords, column?: number): Tile {
        let coords = rowOrCoords as TileCoords
        if (!_.isArray(rowOrCoords)) {
            coords = [rowOrCoords, column!]
        }

        if (coords[0] < 0 || coords[1] < 0 || coords[0] >= this.rowCount || coords[1] >= this.columnCount) {
            return 'wall'
        }

        const itIs = (c: TileCoords) => _.isEqual(coords, c)

        if (itIs(this.headCoords)) {
            return 'head'
        }
        if (this.segmentCoords.some(segment => itIs(segment))) {
            return 'segment'
        }
        if (itIs(this.tailCoords)) {
            return 'tail'
        }
        if (itIs(this.appleCoords)) {
            return 'apple'
        }

        return 'empty'
    }

    /**
     * Move the apple to a random coordinate.
     *
     * If impossible, just move it to [-420, -69] lmao nice
     */
    moveApple(): void {
        if (this.segmentCoords.length + 2 >= this.rowCount * this.columnCount) {
            this.appleCoords = [-420, -69]
            return
        }

        const chance = new Chance()

        let row: number
        let column: number

        do {
            row = chance.integer({ min: 0, max: this.rowCount - 1 })
            column = chance.integer({ min: 0, max: this.columnCount - 1 })
        } while (this.tileAt(row, column) != 'empty')

        this.appleCoords = [row, column]
    }

    /**
     * Get the coordinates of the head after moving in the current {@link direction}.
     */
    private getNewHeadCoords(): TileCoords {
        const result: TileCoords = [...this.headCoords]
        switch (this.direction) {
            case 'up':
                result[0] -= 1
                break

            case 'down':
                result[0] += 1
                break

            case 'left':
                result[1] -= 1
                break

            case 'right':
                result[1] += 1
                break
        }

        return result
    }

    /**
     * Move the snake and each of the segments.
     * If the apple is eaten, move it to a random spot.
     * If the snake bumps into a wall or its own segment, no changes are made.
     * @returns {SnakeMoveResult} 'u survived' if the move was successful,
     * 'u died' if not, 'u won' if there aren't any more spaces to put the apple in
     */
    moveSnake(): SnakeMoveResult {
        const newHeadCoords = this.getNewHeadCoords()
        const tileAtHead = this.tileAt(newHeadCoords)

        if (tileAtHead == 'wall' || tileAtHead == 'segment') {
            return 'u died'
        }

        this.segmentCoords.unshift(this.headCoords)
        this.headCoords = newHeadCoords
        if (tileAtHead == 'apple') {
            this.moveApple()
            this.points += 1
        } else {
            this.tailCoords = this.segmentCoords.pop()!
        }

        if (this.segmentCoords.length + 2 >= this.rowCount * this.columnCount) return 'u won'
        return 'u survived'
    }
}
