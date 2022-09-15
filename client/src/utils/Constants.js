import {io} from "socket.io-client";

export const socket = io()

export const STATUS_CONNECTED = "CONNECTED"
export const STATUS_DISCONNECTED = "DISCONNECTED"
export const STATUS_AVAILABLE = "AVAILABLE"
export const STATUS_BUSY = "BUSY"
export const EVENT_CONNECT = "connect"
export const EVENT_ADD_STRANGER = "add_stranger"
export const EVENT_UPDATE_INTERESTS = "update_interests"
export const EVENT_FIND_STRANGER = "find_stranger"
export const EVENT_MAKE_USER_AVAILABLE = "make_user_available"
export const EVENT_SEND_MESSAGE = "send_message"
export const EVENT_RECEIVE_MESSAGE = "receive_message"
export const EVENT_PARTNER_DISCONNECTED = "partner_disconnected"
export const EVENT_PARTNER_NOT_FOUND = "partner_not_found"
export const EVENT_PARTNER_CONNECTED = "partner_connected"
export const EVENT_VERIFY_USER_TOKEN = "verify_user_token"
export const EVENT_USER_VERIFIED = "user_verified"
export const EVENT_USER_UNVERIFIED = "user_unverified"
export const EVENT_END_CONVERSATION = "end_conversation"
export const EVENT_GET_ONLINE_USERS = "online_users"
export const EVENT_VERIFICATION_LIMIT_EXCEEDED = "verification_limit_exceeded"
export const STRANGER_DISCONNECTED_MESSAGE = "Stranger has disconnected"
export const DISCONNECTED_MESSAGE = "You have disconnected"
export const INTERESTS_IN_LOCAL_STORAGE = "prattle_interests"
export const GOOGLE_SITE_KEY = "REACT_APP_GOOGLE_SITE_KEY"

export function getEnvironmentVariable(name) {
    return process.env[name]
}