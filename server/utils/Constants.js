import {createClient} from "redis";

export const NODE_ENV = "NODE_ENV"
export const STATUS_CONNECTED = "CONNECTED"
export const STATUS_DISCONNECTED = "DISCONNECTED"
export const STATUS_AVAILABLE = "AVAILABLE"
export const STATUS_BUSY = "BUSY"
export const REDIS_URL = "REDIS_URL"
export const MONGODB_URL = "MONGODB_URL"
export const USERS_ONLINE = "users_online"
export const EVENT_DISCONNECT = "disconnect"
export const EVENT_ADD_STRANGER = "add_stranger"
export const EVENT_UPDATE_INTERESTS = "update_interests"
export const EVENT_FIND_STRANGER = "find_stranger"
export const EVENT_MAKE_USER_AVAILABLE = "make_user_available"
export const EVENT_SEND_MESSAGE = "send_message"
export const EVENT_RECEIVE_MESSAGE = "receive_message"
export const EVENT_PARTNER_DISCONNECTED = "partner_disconnected"
export const EVENT_END_CONVERSATION = "end_conversation"
export const EVENT_PARTNER_NOT_FOUND = "partner_not_found"
export const EVENT_PARTNER_CONNECTED = "partner_connected"
export const EVENT_VERIFY_USER_TOKEN = "verify_user_token"
export const EVENT_USER_VERIFIED = "user_verified"
export const EVENT_USER_UNVERIFIED = "user_unverified"
export const EVENT_GET_ONLINE_USERS = "online_users"
export const EVENT_VERIFICATION_LIMIT_EXCEEDED = "verification_limit_exceeded"
export const GOOGLE_SECRET_KEY = "GOOGLE_SECRET_KEY"
export const GOOGLE_SITE_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

export function getEnvironmentVariable(name) {
    return process.env[name]
}

export const redisClient = createClient({
    url: getEnvironmentVariable(REDIS_URL)
})
redisClient.on('error', (err) => console.log('Redis Client Error', err));