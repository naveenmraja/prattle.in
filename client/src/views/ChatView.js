import * as React from "react";
import {Component, Fragment} from "react";
import {connect} from "react-redux";
import {socket} from "../utils/Constants"
import {Button, Grid, Paper, TextField} from "@mui/material";
import {styled} from "@mui/styles";
import {SendRounded} from "@mui/icons-material";
import {Navigate} from "react-router-dom";
import Loader from "../components/Loader";
import {
    addMessage,
    addMessageId,
    clearMessageIds,
    clearMessages,
    disconnectConversation,
    hideLoader,
    showLoader,
    startNewConversation,
    updateCommonInterests,
    updateCurrentMessage,
    updateDisconnectedMessage,
    updatePartnerSocketId,
    updateShowConfirmButton,
    updateShowLoadingButton,
    updateShowRefreshButton,
    updateStatus
} from "../features/user/PrattleSlice";
import * as Constants from "../utils/Constants.js";
import ChatBanner from "../components/ChatBanner";
import MessageCard from "../components/MessageCard";
import LeftButton from "../components/LeftButton";
import {nanoid} from 'nanoid'

function mapStateToProps(state) {
    return {
        user: state.prattle.user,
        ui: state.prattle.ui
    }
}

const StyledPaper = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary
}))

class ChatView extends Component {

    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.textFieldRef = React.createRef();
    }

    sendMessage = () => {
        if (this.props.user.status === Constants.STATUS_BUSY) {
            this.props.dispatch(updateShowConfirmButton(false))
            this.props.dispatch(updateShowRefreshButton(false))
            this.props.dispatch(updateShowLoadingButton(false))
        }
        if (this.props.ui.currentMessage) {
            const message = {
                id: nanoid(),
                socketId: this.props.user.socketId,
                content: this.props.ui.currentMessage,
                partnerSocketId: this.props.user.partnerSocketId
            }
            this.props.dispatch(addMessage(message))
            socket.emit(Constants.EVENT_SEND_MESSAGE, message)
        }
        this.textFieldRef.current.focus()
        this.scrollToBottom()
    }

    componentDidUpdate(prevProps, prevState) {
        this.textFieldRef.current.focus();
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.scrollRef.current.scrollIntoView();
    }

    componentDidMount() {
        if (this.props.user.verified && this.props.user.status !== Constants.STATUS_BUSY) {
            this.props.dispatch(showLoader())
            socket.emit(Constants.EVENT_ADD_STRANGER, {interests: this.props.user.interests})
            this.props.dispatch(updateStatus(Constants.STATUS_AVAILABLE))
            socket.emit(Constants.EVENT_UPDATE_INTERESTS, {interests: this.props.user.interests})
            socket.emit(Constants.EVENT_MAKE_USER_AVAILABLE)
            socket.emit(Constants.EVENT_FIND_STRANGER, {interests: this.props.user.interests})
        }

        socket.on(Constants.EVENT_PARTNER_CONNECTED, (message) => {
            const partnerSocketId = message.connectedTo
            const partnerInterests = message.interests.map(value => value.toLowerCase())
            this.props.dispatch(updatePartnerSocketId(partnerSocketId))
            const interests = this.props.user.interests
            const commonInterests = interests.filter(value => partnerInterests.includes(value.toLowerCase()));
            this.props.dispatch(updateStatus(Constants.STATUS_BUSY))
            this.props.dispatch(clearMessages())
            this.props.dispatch(clearMessageIds())
            this.props.dispatch(updateDisconnectedMessage(""))
            this.props.dispatch(updateCommonInterests(commonInterests))
            this.props.dispatch(updateShowConfirmButton(false))
            this.props.dispatch(updateShowRefreshButton(false))
            this.props.dispatch(updateShowLoadingButton(false))
            this.props.dispatch(hideLoader())
            this.textFieldRef.current.focus()
        })

        socket.on(Constants.EVENT_RECEIVE_MESSAGE, (payload) => {
            const partnerSocketId = payload.from
            const messageId = payload.id
            const isNewMessage = !(messageId in this.props.ui.messageIds)
            if (partnerSocketId === this.props.user.partnerSocketId && payload.message && isNewMessage) {
                this.props.dispatch(addMessageId(messageId))
                this.props.dispatch(addMessage({socketId: partnerSocketId, content: payload.message}))
            }
        })

        socket.on(Constants.EVENT_PARTNER_NOT_FOUND, () => {
            if (this.props.user.status === Constants.STATUS_AVAILABLE) {
                socket.emit(Constants.EVENT_FIND_STRANGER, {interests: this.props.user.interests})
            }
        })

        socket.on(Constants.EVENT_PARTNER_DISCONNECTED, () => {
            if (this.props.user.status === Constants.STATUS_BUSY) {
                this.props.dispatch(updateStatus(Constants.STATUS_CONNECTED))
                this.props.dispatch(updatePartnerSocketId(""))
                this.props.dispatch(updateCurrentMessage(""))
                this.props.dispatch(updateShowRefreshButton(true))
                this.props.dispatch(updateShowConfirmButton(false))
                this.props.dispatch(updateShowLoadingButton(false))
                this.props.dispatch(updateDisconnectedMessage(Constants.STRANGER_DISCONNECTED_MESSAGE))
            }
        })
    }

    handleTextInput = (event) => {
        if (!event.defaultPrevented) {
            this.props.dispatch(updateCurrentMessage(event.target.value))
        }
    }

    handleKeyDown = (event) => {
        this.scrollToBottom()
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            this.sendMessage()
        } else if (event.key === "Escape") {
            event.preventDefault()
            if (this.props.ui.showConfirmButton) {
                this.props.dispatch(disconnectConversation())
            } else if (this.props.ui.showRefreshButton) {
                this.props.dispatch(startNewConversation())
            } else if (!this.props.ui.showLoadingButton) {
                if (this.props.user.status === Constants.STATUS_BUSY) {
                    this.props.dispatch(updateShowConfirmButton(true))
                }
            }
        }
    }

    getChatHeaderMessage = () => {
        let headerMessage = "You are now chatting with a stranger. Say Hi!"
        if (this.props.user.commonInterests.length > 0) {
            headerMessage = "You both like <b>" + this.props.user.commonInterests.join() + "</b>"
        } else if (this.props.user.interests.length > 0) {
            headerMessage = "Prattle couldn't find anyone who shares interests with you, so this stranger is completely random. Try adding more interests!"
        }
        if (this.props.user.status === Constants.STATUS_AVAILABLE) {
            headerMessage = "Please wait while we find someone for you to prattle with"
        }
        return headerMessage
    }

    render() {
        if (!this.props.user.verified) {
            return (<Navigate to={"/"}/>)
        }
        const messages = this.props.ui.messages
        const messagesView = messages.map((message, index) => <MessageCard message={message}
                                                                           index={index} key={`message-card-${index}`}
                                                                           socketId={this.props.user.socketId}/>)
        const headerMessage = this.getChatHeaderMessage()
        return (
            <Fragment>
                <Loader showLoader={this.props.ui.showLoader}/>
                <Grid container spacing={2} sx={{flexGrow: 1}}>
                    <Grid item sx={{width: "100%", ml: "5%", mr: "5%"}}>
                        <StyledPaper
                            sx={{padding: "10px", width: "100%", height: "70vh", mt: "1%", overflow: 'scroll'}}>
                            <Grid container sx={{width: "100%"}} spacing={1}>
                                <ChatBanner bannerMessage={headerMessage}/>
                                {messagesView}
                                <ChatBanner color={"crimson"} bannerMessage={this.props.ui.disconnectedMessage}/>
                                <div ref={this.scrollRef}/>
                            </Grid>
                        </StyledPaper>
                    </Grid>
                    <Grid item sx={{width: "100%", ml: "5%", mr: "5%"}}>
                        <Grid container spacing={2} sx={{height: "10vh"}}>
                            <Grid item md={1} xs={3}>
                                <LeftButton/>
                            </Grid>
                            <Grid item md={10} xs={6}>
                                <TextField
                                    sx={{height: "100%"}}
                                    multiline
                                    fullWidth
                                    rows={2}
                                    disabled={this.props.user.status !== Constants.STATUS_BUSY}
                                    color={"success"}
                                    value={this.props.ui.currentMessage} onChange={this.handleTextInput}
                                    onKeyDown={this.handleKeyDown}
                                    inputRef={this.textFieldRef}
                                />
                            </Grid>
                            <Grid item md={1} xs={3}>
                                <Button fullWidth variant="contained" color={"success"} sx={{height: "100%"}}
                                        disabled={this.props.user.status !== Constants.STATUS_BUSY}
                                        onClick={this.sendMessage} type={"submit"}>
                                    <SendRounded fontSize={"large"}/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default connect(mapStateToProps)(ChatView)