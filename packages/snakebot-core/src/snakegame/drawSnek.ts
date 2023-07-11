import { SnakeDirection, SnakeGrid, TileCoords } from './SnakeGrid.js'

function directionToRadians(dir: SnakeDirection): number {
    switch (dir) {
        case 'up':
            return Math.PI
        case 'left':
            return Math.PI / 2
        case 'down':
            return 0
        case 'right':
            return Math.PI * 1.5
    }
}

const colors = {
    body: '#416ED8',
    eyes: 'white',
    pupils: 'black',
    bgEven: '#BCC7DC',
    bgOdd: '#ABB9D4',
    apple: '#0A8754',
}

/**
 * Draws the given {@link SnakeGrid} to a canvas.
 */
export function drawSnek(
    grid: SnakeGrid,
    ctx: OffscreenCanvasRenderingContext2D,
    imgWidth: number,
    imgHeight: number
): void {
    const rowHeight = imgHeight / grid.rowCount
    const columnWidth = rowHeight

    const tileToCoords = (tile: TileCoords): [x: number, y: number] => {
        const x = columnWidth * tile[1] + columnWidth / 2
        const y = rowHeight * tile[0] + rowHeight / 2
        return [x, y]
    }

    const segmentRadius = columnWidth / 2 / 1.15
    const eyeRadius = segmentRadius / 4
    const pupilRadius = eyeRadius / 1.5

    const horizontalWidth = columnWidth * grid.columnCount
    const horizontalPadding = (imgWidth - horizontalWidth) / 2
    ctx.translate(horizontalPadding, 0)

    // draw a grid of squares of alternating colors
    function drawBackground(): void {
        ctx.beginPath()
        for (let column = 0; column < grid.columnCount; column++) {
            for (let row = 0; row < grid.rowCount; row++) {
                const color = (column + row) % 2 == 0 ? colors.bgEven : colors.bgOdd
                ctx.fillStyle = color
                let [x, y] = tileToCoords([row, column])
                x -= columnWidth / 2
                y -= rowHeight / 2

                // the width and height of each square is extended a bit
                // to prevent white lines appearing between them
                // idk why it happens xd
                ctx.fillRect(x, y, columnWidth + 5, rowHeight + 5)
            }
        }

        ctx.closePath()
    }

    // draw an eye
    function drawEye(x: number, y: number): void {
        ctx.save()
        {
            ctx.beginPath()
            ctx.translate(x, y)

            ctx.fillStyle = 'white'
            ctx.ellipse(0, 0, eyeRadius, eyeRadius, 0, 0, Math.PI * 2)
            ctx.fill()

            // point the eye toward the apple
            const eyePosition = ctx.getTransform().transformPoint({ x: 0, y: 0 })
            const applePosition = tileToCoords(grid.appleCoords)
            applePosition[0] += horizontalPadding
            const eyeAngle =
                Math.atan2(applePosition[1] - eyePosition.y, applePosition[0] - eyePosition.x) - Math.PI / 2

            ctx.beginPath()
            ctx.rotate(-directionToRadians(grid.direction))
            ctx.rotate(eyeAngle)
            ctx.translate(0, pupilRadius / 2)
            ctx.fillStyle = 'black'
            ctx.ellipse(0, 0, pupilRadius, pupilRadius, 0, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.restore()
    }

    // draw two eyes
    function drawHead(x: number, y: number): void {
        ctx.save()
        {
            ctx.translate(x, y)

            const angle = directionToRadians(grid.direction)
            ctx.rotate(angle)

            drawEye(segmentRadius / 2, segmentRadius / 2)
            drawEye(-segmentRadius / 2, segmentRadius / 2)
            ctx.restore()
        }
        ctx.restore()
    }

    // draw a circle, and a rectangle connecting this segment to the next one
    function drawSegment(thisX: number, thisY: number, nextX?: number, nextY?: number): void {
        ctx.save()
        {
            ctx.fillStyle = colors.body
            ctx.translate(thisX, thisY)
            ctx.beginPath()
            ctx.ellipse(0, 0, segmentRadius, segmentRadius, 0, 0, Math.PI * 2)
            ctx.fill()

            if (nextX != undefined && nextY != undefined) {
                const angle = Math.atan2(nextY - thisY, nextX - thisX)
                ctx.rotate(angle)
                ctx.fillRect(0, -segmentRadius, columnWidth, segmentRadius * 2)
            }
        }
        ctx.restore()
    }

    drawBackground()
    const segments = [grid.headCoords, ...grid.segmentCoords, grid.tailCoords]
    for (let i = 0; i < segments.length; i++) {
        const thisSegment = segments.at(i)!
        const nextSegment = segments.at(i + 1)
        const [nextX, nextY] = nextSegment ? tileToCoords(nextSegment) : [undefined, undefined]
        drawSegment(...tileToCoords(thisSegment), nextX, nextY)
    }

    drawHead(...tileToCoords(grid.headCoords))

    // someday i should make a better apple graphic than "literally just a circle"
    // but today is not that day
    ctx.beginPath()
    ctx.fillStyle = colors.apple
    const [appleX, appleY] = tileToCoords(grid.appleCoords)
    // ctx.rect(appleX - segmentRadius, appleY-segmentRadius, segmentRadius*2, segmentRadius*2)
    ctx.ellipse(appleX, appleY, segmentRadius, segmentRadius, 0, 0, Math.PI * 2)
    ctx.fill()
}
