import { config as dotenv } from 'dotenv'
import { login, mastodon } from 'masto'
import { getHeader, hasHeader, addHeader } from './roundHeaders'

import { constructRound, getFirstRound, getSubsequentRound } from './roundMaking'
import { SnakeGame } from 'snakebot-core'
import { postRound } from './roundPosting'
import { htmlToPlaintext } from './utils'

import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

dotenv({
    path: './.env',
})

const token = process.env.BOT_ACCESS_TOKEN
const username = process.env.BOT_USERNAME
const instanceUrl = process.env.BOT_INSTANCE_URL

if (!token || !username || !instanceUrl) {
    throw new Error('u didnt set the env variables smh')
}

console.log(`logging in to ${instanceUrl} as @${username} ....`)
const client = await login({
    url: instanceUrl,
    accessToken: token,
    disableVersionCheck: true,
})

console.log('done :]')
console.log('looking up user ID ...')
const account = await client.v1.accounts.lookup({
    acct: username,
})

const userId = account.id
console.log(`done :] user id is ${userId}`)

let statuses: mastodon.v1.Status[]
let retryCount = 3
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
while (true) {
    console.log('fetching statuses ...')
    try {
        statuses = await client.v1.accounts.listStatuses(userId)
        break
    } catch (e) {
        retryCount -= 1
        console.log('error while fetching posts :[')
        console.log(e)

        if (retryCount > 0) {
            console.log('retrying in 7 seconds....')
            await new Promise(resolve => setTimeout(resolve, 7000))
        } else {
            console.log("yea screw this i give up. maybe it'll work better next time")
            process.exit(69)
        }
    }
}

statuses.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1))
console.log('done :]')

const lastRoundToot = statuses.find(s => hasHeader(htmlToPlaintext(s.content)))
const header = lastRoundToot && getHeader(htmlToPlaintext(lastRoundToot.content))

console.log('header is:')
console.log(header)

if (!header || header.gameOver) {
    console.log('creating first round!')
    const gameId = (header?.gameId ?? 0) + 1
    const round = await getFirstRound(SnakeGame, gameId)
    const roundWithHeader = addHeader(round, 'Snake', gameId)
    await postRound(client, roundWithHeader)
} else {
    console.log('creating next round :]')
    const lastRoundContext = await client.v1.statuses.fetchContext(lastRoundToot.id)
    const lastRound = constructRound(lastRoundToot, lastRoundContext.descendants)

    const nextRound = await getSubsequentRound(SnakeGame, lastRound, header.gameId)
    const roundWithHeader = addHeader(nextRound, 'Snake', header.gameId)
    await postRound(client, roundWithHeader)
}
