import { createSlice } from "@reduxjs/toolkit";
import {socket} from "../../utils/Constants.js";
import * as Constants from "../../utils/Constants";

const initialState = {
    user : {
        socketId: "",
        interests : localStorage.getItem(Constants.INTERESTS_IN_LOCAL_STORAGE) ?
            JSON.parse(localStorage.getItem(Constants.INTERESTS_IN_LOCAL_STORAGE)) : [],
        partnerSocketId : "",
        status : Constants.STATUS_DISCONNECTED,
        verified : false,
        token : "",
        refreshToken : false,
        commonInterests : [],
        verificationLimitExceeded : false
    },
    ui : {
        onlineUsers : 1,
        currentInterest : "",
        currentMessage : "",
        messages : [],
        messageIds : [],
        interestsInputError : false,
        interestsInputErrorMessage : "",
        displayTermsAndConditions : false,
        showLoader : true,
        showVerifiedSnackbar : false,
        showLimitExceededSnackbar : false,
        showConfirmButton : false,
        showRefreshButton : false,
        showLoadingButton : false,
        disconnectedMessage : ""
    }
}

export const prattleSlice = createSlice({
    name : "prattle",
    initialState,
    reducers : {
        updateSocketId : (state, action) => {
            state.user.socketId = action.payload
        },
        updatePartnerSocketId : (state, action) => {
            state.user.partnerSocketId = action.payload
        },
        updateCommonInterests : (state, action) => {
            state.user.commonInterests = action.payload
        },
        updateStatus : (state, action) => {
            state.user.status = action.payload
        },
        updateOnlineUsers : (state, action) => {
            state.ui.onlineUsers = action.payload
        },
        addInterest : (state, action) => {
            if(state.user.interests.length === 10) {
                state.ui.interestsInputError = true
                state.ui.interestsInputErrorMessage = "You can only add up to 10 interests. Please delete some to add new interests."
            } else {
                const interest = action.payload
                if(interest) {
                    const index = state.user.interests.indexOf(interest)
                    if (index === -1) {
                        state.user.interests.push(interest)
                    }
                    localStorage.setItem(Constants.INTERESTS_IN_LOCAL_STORAGE, JSON.stringify(state.user.interests))
                    state.ui.currentInterest = ""
                }
            }
        },
        removeInterest: (state, action) => {
            const interests = state.user.interests
            const index = interests.indexOf(action.payload)
            if (index > -1) {
                state.user.interests.splice(index, 1);
                state.ui.interestsInputError = false
                state.ui.interestsInputErrorMessage = ""
                localStorage.setItem(Constants.INTERESTS_IN_LOCAL_STORAGE, JSON.stringify(state.user.interests))
            }
        },
        updateCurrentMessage : (state, action) => {
            state.ui.currentMessage = action.payload
        },
        addMessage : (state, action) => {
            const message = action.payload
            state.ui.messages.push(message)
            state.ui.currentMessage = ""
        },
        clearMessages : (state) => {
            state.ui.messages = []
            state.ui.currentMessage = ""
        },
        addMessageId : (state, action) => {
            state.ui.messageIds.push(action.payload)
        },
        clearMessageIds : (state) => {
            state.ui.messageIds = []
        },
        updateCurrentInterest : (state, action) => {
            state.ui.currentInterest = action.payload
        },
        toggleDisplayTermsAndConditions : (state) => {
            state.ui.displayTermsAndConditions = !state.ui.displayTermsAndConditions
        },
        updateToken : (state, action) => {
            state.user.token = action.payload
        },
        verifyUser : (state) => {
            state.user.verified = true
        },
        hideLoader : (state) => {
            state.ui.showLoader = false
        },
        showLoader : (state) => {
            state.ui.showLoader = true
        },
        showVerifiedSnackbar : (state) => {
            state.ui.showVerifiedSnackbar = true
        },
        hideVerifiedSnackbar : (state) => {
            state.ui.showVerifiedSnackbar = false
        },
        showLimitExceededSnackbar : (state) => {
            state.ui.showLimitExceededSnackbar = true
        },
        hideLimitExceededSnackbar : (state) => {
            state.ui.showLimitExceededSnackbar = false
        },
        updateRefreshToken : (state, action) => {
            state.user.refreshToken = action.payload
        },
        setVerificationLimitExceeded : (state) => {
            state.user.verificationLimitExceeded = true
        },
        updateShowConfirmButton : (state, action) => {
            state.ui.showConfirmButton = action.payload
        },
        updateShowRefreshButton : (state, action) => {
            state.ui.showRefreshButton = action.payload
        },
        updateShowLoadingButton : (state, action) => {
            state.ui.showLoadingButton = action.payload
        },
        updateDisconnectedMessage : (state, action) => {
            state.ui.disconnectedMessage = action.payload
        },
        disconnectConversation : (state) => {
            if(state.user.status === Constants.STATUS_BUSY) {
                state.ui.showLoadingButton = true
                state.user.status = Constants.STATUS_CONNECTED
                socket.emit(Constants.EVENT_END_CONVERSATION)
                state.user.partnerSocketId = ""
                state.ui.currentMessage = ""
                state.ui.showRefreshButton = true
                state.ui.showConfirmButton = false
                state.ui.showLoadingButton = false
                state.ui.disconnectedMessage = Constants.DISCONNECTED_MESSAGE
                socket.emit(Constants.EVENT_END_CONVERSATION)
            }
        },
        startNewConversation : (state) => {
            if(state.user.status !== Constants.STATUS_BUSY) {
                socket.emit(Constants.EVENT_MAKE_USER_AVAILABLE)
                socket.emit(Constants.EVENT_FIND_STRANGER, { interests : state.user.interests })
                state.user.status = Constants.STATUS_AVAILABLE
                state.ui.showLoadingButton = true
                state.ui.showRefreshButton = false
                state.ui.showLoader = true
            }
        }
    }
})

export const { updateSocketId, updatePartnerSocketId, updateStatus, updateOnlineUsers, addInterest, verifyUser, showLoader,
    hideLoader, removeInterest, updateCurrentInterest, toggleDisplayTermsAndConditions, updateToken, updateCommonInterests,
    addMessage, addMessageId, clearMessageIds, updateCurrentMessage, updateRefreshToken, updateShowConfirmButton,
    updateShowRefreshButton, updateShowLoadingButton, clearMessages, updateDisconnectedMessage, disconnectConversation,
    startNewConversation, setVerificationLimitExceeded, showVerifiedSnackbar, hideVerifiedSnackbar,
    showLimitExceededSnackbar, hideLimitExceededSnackbar } = prattleSlice.actions

export default prattleSlice.reducer