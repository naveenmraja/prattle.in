import mongoose from "mongoose"

const strangerSchema = new mongoose.Schema({
    socketId: {
        type: String,
        index: true
    },
    status: {
        type: String,
        index: true
    },
    interests: {
        type: [String],
        index: true
    },
    connectedTo: String
}, {timestamps: true})

export const Stranger = new mongoose.model('Stranger', strangerSchema)