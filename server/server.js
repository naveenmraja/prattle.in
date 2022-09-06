import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from "mongoose"
import {mongooseOptions} from "./utils/Config.js"
import * as Constants from './utils/Constants.js'
import {
    getEnvironmentVariable
} from './utils/Constants.js'
import * as PrattleService from "./services/PrattleService.js"
import { log } from './utils/Logger.js'

await PrattleService.initRedisConnection()
await mongoose.connect(getEnvironmentVariable(Constants.MONGODB_URL),
    mongooseOptions[getEnvironmentVariable(Constants.NODE_ENV)])

const app = express()

const httpServer = createServer(app)
const io = new Server(httpServer)

io.on("connection", async (socket) => {
    try  {
        log.info(`New connection created : ${socket.id}`)
        await PrattleService.incrementOnlineUsers()

        socket.on(Constants.EVENT_GET_ONLINE_USERS, async() => {
            await PrattleService.getOnlineUsers(socket)
        })

        socket.on(Constants.EVENT_ADD_STRANGER, async (payload) => {
            await PrattleService.addStranger(socket, payload)
        })

        socket.on(Constants.EVENT_UPDATE_INTERESTS, async (payload) => {
            await PrattleService.updateInterests(socket, payload)
        })

        socket.on(Constants.EVENT_MAKE_USER_AVAILABLE, async () => {
            await PrattleService.makeUserAvailable(socket)
        })

        socket.on(Constants.EVENT_SEND_MESSAGE, async (message) => {
            await PrattleService.sendMessage(socket, message)
        })

        socket.on(Constants.EVENT_FIND_STRANGER, async (message) => {
            await PrattleService.findStranger(socket, message)
        })

        socket.on(Constants.EVENT_END_CONVERSATION, async() => {
            await PrattleService.endConversation(socket)
        })

        socket.on(Constants.EVENT_DISCONNECT, async (reason) => {
            await PrattleService.disconnectUser(socket)
        })

        socket.on(Constants.EVENT_VERIFY_USER_TOKEN, async (message) => {
            await PrattleService.verifyUserToken(socket, message)
        })
    } catch (e) {
        log.error(`Error occurred inside connection listener ${e}`)
    }
});

app.get('/ping', async (req, res) => {
    res.status(200).send("pong")
})

httpServer.listen(8080, () => {
    log.info("Listening on port 8080")
})

process.on('SIGTERM', async () => {
    await PrattleService.closeRedisConnection()
    process.exit(0);
});