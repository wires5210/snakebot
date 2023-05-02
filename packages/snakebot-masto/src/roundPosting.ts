import { mastodon } from 'masto'
import { OutgoingRound } from 'snakebot-core'
import { createCanvas } from 'canvas'
import getStream from 'get-stream'

const postVisibility = process.env.BOT_POST_PRIVATELY === 'true' ? 'private' : 'public'

export async function postRound(client: mastodon.Client, round: OutgoingRound): Promise<void> {
    let lastTootId: string | undefined

    for (const t of round.toots) {
        let retryCount = 10

        const makePost = async () => {
            console.log('tryin to make a post :-\\')
            let imageId: string | undefined
            let poll: mastodon.v1.CreateStatusPollParam | undefined

            if (t.image) {
                console.log('drawing image..')
                const canvas = createCanvas(t.image.width, t.image.height)
                const context = canvas.getContext('2d')

                //@ts-expect-error it's not *entirely* compatible with canvas, but it works
                t.image.draw(context)

                const stream = canvas.createPNGStream()
                const buffer = await getStream.buffer(stream)

                console.log('uploading image..')
                const uploaded = await client.v1.mediaAttachments.create({
                    file: new Blob([buffer]),
                    description: t.image.altText,
                })

                console.log('done :]')

                imageId = uploaded.id
            }

            if (t.pollOptions) {
                console.log('adding poll..')
                poll = {
                    // this really should be an env variable
                    expiresIn: 7200,
                    options: t.pollOptions,
                }
            }

            // *why* doesn't mastodon allow having both polls and images??
            let tootData: mastodon.v1.CreateStatusParamsWithMediaIds | mastodon.v1.CreateStatusParamsWithStatus
            if (imageId) {
                tootData = {
                    inReplyToId: lastTootId,
                    status: t.content,
                    mediaIds: [imageId],
                    visibility: postVisibility,
                }
            } else {
                tootData = {
                    inReplyToId: lastTootId,
                    status: t.content,
                    poll: poll,
                    visibility: postVisibility,
                }
            }

            console.log('posting ....')
            const toot = await client.v1.statuses.create(tootData)
            lastTootId = toot.id
            console.log('done !!')
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            try {
                await makePost()
                break
            } catch (e) {
                console.log('error when submitting post :[')
                console.log(e)
                retryCount -= 1
                if (retryCount > 0) {
                    console.log('trying again in 10 seconds .... ')
                    //                                    ^^^^^^^^^^ *surely* it'll work by then?
                    await new Promise(resolve => setTimeout(resolve, 10000))
                } else {
                    // this is probably pretty dangerous
                    // since this might result in having posted
                    // some, but not all of the posts
                    // which *will* break the game next time it runs ....
                    // but let's just hope this doesn't happen?
                    console.log('eh forget this.')
                    process.exit(1)
                }
            }
        }
    }
}
