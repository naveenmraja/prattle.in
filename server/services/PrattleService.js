import * as Constants from '../utils/Constants.js'
import {
    redisClient,
    getEnvironmentVariable
} from "../utils/Constants.js"
import {Stranger} from "../model/Stranger.js"
import mongoose from "mongoose";
import { log } from '../utils/Logger.js'

export async function initRedisConnection() {
    try {
        log.info(`Initialising Redis Client`)
        await redisClient.connect()
        await redisClient.set(Constants.USERS_ONLINE, 0)
    } catch (e) {
        log.error(`Error occurred while initialising redis client : ${e.message}`)
    }
}

export async function closeRedisConnection() {
    try {
        log.info(`Closing redis connection`)
        await redisClient.quit()
    } catch (e) {
        log.error(`Error occurred while closing redis client : ${e.message}`)
    }
}

export async function incrementOnlineUsers() {
    try {
        log.info(`Incrementing online users count`)
        await redisClient.incr(Constants.USERS_ONLINE)
    } catch (e) {
        log.error(`Error occurred while incrementing online users count ${e.message}`)
    }
}

export function getVerifyTokenResponse(secretKey, token) {
    const request = {
        response : token,
        secret : getEnvironmentVariable(Constants.GOOGLE_SECRET_KEY)
    }
    let formBody = [];
    for (let property in request) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(request[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    log.info(`Request : ${Constants.GOOGLE_SITE_VERIFY_URL} ${formBody}`)
    return fetch(Constants.GOOGLE_SITE_VERIFY_URL, {
        method : "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    })
}

export async function getOnlineUsers(socket) {
    try {
        const onlineUsers = await redisClient.get(Constants.USERS_ONLINE)
        log.info(`Total online users : ${onlineUsers}`)
        socket.emit(Constants.EVENT_GET_ONLINE_USERS, { onlineUsers : onlineUsers })
    } catch (e) {
        log.error(`Error occurred while getting Online users count ${e.message}`)
    }
}

async function isUserVerified(socket) {
    const verified = await redisClient.get(`VERIFIED_${socket.id}`)
    return (verified === "true")
}

export async function addStranger(socket, payload) {
    try {
        if(await isUserVerified(socket) && payload.interests.length <= 10) {
            log.info(`Add stranger : ${socket.id} ${JSON.stringify(payload)}`)
            const interests = payload.interests
            const stranger = new Stranger({
                socketId : socket.id,
                status : Constants.STATUS_CONNECTED,
                interests: interests,
                connectedTo : "" })
            await stranger.save()
        }
    } catch (e) {
        log.error(`Error occurred while adding stranger ${socket.id} : ${e.message}`)
    }
}

export async function updateInterests(socket, payload) {
    try {
        if(await isUserVerified(socket) && payload.interests.length <= 10) {
            log.info(`Updating interests for ${socket.id} : ${JSON.stringify(payload)}`)
            const interests = payload.interests
            await Stranger.updateOne({ socketId : socket.id }, { interests : interests })
        }
    } catch (e) {
        log.error(`Error occurred while updating interests for ${socket.id} : ${e.message}`)
    }
}

export async function makeUserAvailable(socket) {
    try {
        if(await isUserVerified(socket)) {
            log.info(`Making user ${socket.id} available for new chat connection`)
            await Stranger.updateOne({ socketId : socket.id }, { status : Constants.STATUS_AVAILABLE })
        }
    } catch (e) {
        log.error(`Error while making user ${socket.id} available for a new chat connection : ${e.message}`)
    }
}

export async function sendMessage(socket, message) {
    try {
        if(await isUserVerified(socket)) {
            const partnerId = await redisClient.get(socket.id)
            log.info(`Sending message ${message.content} from ${socket.id} to ${partnerId}`)
            if(partnerId === message.partnerSocketId) {
                const payload = {
                    id: message.id,
                    from : socket.id,
                    message : message.content
                }
                socket.to(partnerId).emit(Constants.EVENT_RECEIVE_MESSAGE, payload)
            }
        }
    } catch (e) {
        log.error(`Error occurred while sending message from ${socket.id} ${message} : ${e.message}`)
    }
}

export async function findStranger(socket, message) {
    try {
        if(await isUserVerified(socket)) {
            const socketId = socket.id
            log.info(`Finding stranger for ${socketId} ${JSON.stringify(message)}`)
            const interests = message.interests ? message.interests : []
            const query = {
                socketId : { $ne : socketId },
                status : Constants.STATUS_AVAILABLE
            }
            if(interests.length > 0) {
                query.interests = { $in : interests}
            }
            const session = await mongoose.startSession()
            session.startTransaction()
            const potentialPartners = await Stranger.find(query).limit(5).exec()
            let partner
            if(potentialPartners.length === 0) {
                partner = await Stranger.findOne({
                    socketId : { $ne : socketId },
                    status : Constants.STATUS_AVAILABLE
                }).exec()
            } else {
                potentialPartners.map((stranger) => {
                    const commonInterests = stranger.interests.filter(interest => interests.includes(interest))
                    stranger.commonInterests = commonInterests.length
                })
                partner = potentialPartners.reduce((prev, current) => {
                    return (prev.commonInterests > current.commonInterests) ? prev : current
                })
            }
            if(partner) {
                const partnerSocketId = partner.socketId
                await Stranger.updateOne({ socketId : socketId }, { status : Constants.STATUS_BUSY, connectedTo : partnerSocketId })
                await Stranger.updateOne({ socketId : partnerSocketId }, { status : Constants.STATUS_BUSY, connectedTo : socketId })
                await redisClient.set(socketId, partnerSocketId)
                await redisClient.set(partnerSocketId, socketId)
            }
            await session.commitTransaction()
            await session.endSession()
            if(partner) {
                socket.emit(Constants.EVENT_PARTNER_CONNECTED, {
                    connectedTo : partner.socketId,
                    interests : partner.interests
                })
                socket.to(partner.socketId).emit(Constants.EVENT_PARTNER_CONNECTED, {
                    connectedTo : socketId,
                    interests : interests
                })
            } else {
                socket.emit(Constants.EVENT_PARTNER_NOT_FOUND)
            }
        }
    } catch (e) {
        log.error(`Error occured while finding stranger for ${socket.id} : ${e.message}`)
    }
}

export async function endConversation(socket) {
    try {
        if(await isUserVerified(socket)) {
            const partnerId = await redisClient.get(socket.id)
            log.info(`Ending conversation of ${socket.id} and ${partnerId}`)
            if(partnerId) {
                await redisClient.del(socket.id)
                await redisClient.del(partnerId)
                await Stranger.updateOne({ socketId: partnerId }, { status : Constants.STATUS_CONNECTED, connectedTo : "" })
                socket.to(partnerId).emit(Constants.EVENT_PARTNER_DISCONNECTED)
            }
            await Stranger.updateOne({ socketId :  socket.id }, { status : Constants.STATUS_CONNECTED, connectedTo : "" })
        }
    } catch (e) {
        log.error(`Error occurred while ending conversation of ${socket.id} : ${e.message}`)
    }
}

export async function disconnectUser(socket) {
    try {
        const partnerId = await redisClient.get(socket.id)
        log.info(`User ${socket.id} got disconnected. Partner : ${partnerId}`)
        if(partnerId) {
            await redisClient.del(socket.id)
            await redisClient.del(partnerId)
            socket.to(partnerId).emit(Constants.EVENT_PARTNER_DISCONNECTED)
            await Stranger.updateOne({ socketId: partnerId }, { status : Constants.STATUS_CONNECTED, connectedTo : "" })
        }
        await Stranger.updateOne({ socketId :  socket.id }, { status : Constants.STATUS_DISCONNECTED, connectedTo : "" })
        if(await isUserVerified(socket)) {
            await redisClient.del(`VERIFIED_${socket.id}`)
        }
        await redisClient.decr(Constants.USERS_ONLINE)
    } catch (e) {
        log.error(`Error occurred while handling user ${socket.id} disconnection : ${e.message}`)
    }
}

async function canVerifyUserToken(socket) {
    try {
        const verificationAttempts = await redisClient.get(`VERIFICATION_ATTEMPTS_${socket.id}`)
        return (verificationAttempts !== "10")
    } catch (e) {
        log.error(`Error occurred while checking if user can verify token ${socket.id} ${e.message}`)
    }
}

export async function verifyUserToken(socket, message) {
    try {
        if(await canVerifyUserToken(socket)) {
            const token = message.token
            const secretKey = getEnvironmentVariable(Constants.GOOGLE_SECRET_KEY)
            log.info(`Verifying token ${token} for ${socket.id}`)
            const response = await getVerifyTokenResponse(secretKey, token)
            if(response.ok) {
                const result = await response.json()
                log.info(`Verify token response for ${socket.id}: ${JSON.stringify(result)}`)
                if(result.success) {
                    if(result.score >= 0.6) {
                        log.info(`User verification successful for ${socket.id}. Score : ${result.score}`)
                        await redisClient.set(`VERIFIED_${socket.id}`, "true")
                        socket.emit(Constants.EVENT_USER_VERIFIED, message)
                    } else {
                        log.info(`Score too low for user ${socket.id} : ${result.score}`)
                        socket.emit(Constants.EVENT_USER_UNVERIFIED, message)
                    }
                    const verificationAttempts = await redisClient.get(`VERIFICATION_ATTEMPTS_${socket.id}`)
                    if(!verificationAttempts) {
                        await redisClient.set(`VERIFICATION_ATTEMPTS_${socket.id}`, 1, 'EX', 60 * 60)
                    } else {
                        await redisClient.incr(`VERIFICATION_ATTEMPTS_${socket.id}`)
                    }
                } else {
                    socket.emit(Constants.EVENT_USER_UNVERIFIED, message)
                }
            } else {
                log.error(`Error while verifying token : ${response.status} ${response.errorMessage}`)
                socket.emit(Constants.EVENT_USER_UNVERIFIED, message)
            }
        } else {
            socket.emit(Constants.EVENT_VERIFICATION_LIMIT_EXCEEDED)
        }
    } catch (e) {
        log.error(`Error occurred while verifying user token for ${socket.id} : ${e.message}`)
    }
}