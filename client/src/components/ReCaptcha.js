import * as React from "react";
import {Component} from "react";
import {connect} from "react-redux";
import * as Constants from "../utils/Constants";
import {socket} from "../utils/Constants";
import {GoogleReCaptcha} from "react-google-recaptcha-v3";
import {
    hideLimitExceededSnackbar,
    hideLoader,
    hideVerifiedSnackbar,
    setVerificationLimitExceeded,
    showLimitExceededSnackbar,
    showVerifiedSnackbar,
    updateRefreshToken,
    updateSocketId,
    updateStatus,
    updateToken,
    verifyUser
} from "../features/user/PrattleSlice";

function mapStateToProps(state) {
    return {
        user: state.prattle.user
    }
}

class ReCaptcha extends Component {

    componentDidMount() {

        if (this.props.user.status !== Constants.STATUS_DISCONNECTED) {
            this.props.dispatch(hideLoader())
        }

        socket.on(Constants.EVENT_CONNECT, () => {
            if (this.props.user.status === Constants.STATUS_DISCONNECTED) {
                this.props.dispatch(updateSocketId(socket.id))
                this.props.dispatch(updateStatus(Constants.STATUS_CONNECTED))
                this.props.dispatch(hideLoader())
            }
        })

        socket.on(Constants.EVENT_USER_VERIFIED, (message) => {
            if (!this.props.user.verified) {
                this.props.dispatch(verifyUser())
                this.props.dispatch(hideVerifiedSnackbar())
                this.props.dispatch(showVerifiedSnackbar())
                this.props.dispatch(updateRefreshToken(false))
            }
        })

        socket.on(Constants.EVENT_USER_UNVERIFIED, (message) => {
            if (!this.props.user.verified && !this.props.user.verificationLimitExceeded) {
                setTimeout(() => {
                    this.props.dispatch(updateRefreshToken(true))
                }, 3000)
            }
        })

        socket.on(Constants.EVENT_VERIFICATION_LIMIT_EXCEEDED, () => {
            this.props.dispatch(setVerificationLimitExceeded())
            this.props.dispatch(hideLimitExceededSnackbar())
            this.props.dispatch(showLimitExceededSnackbar())
        })

    }

    verifyToken = (token) => {
        if (this.props.user.socketId && !this.props.user.verified) {
            socket.emit(Constants.EVENT_VERIFY_USER_TOKEN, {token: token})
        }
    }

    updateToken = (token) => {
        this.props.dispatch(updateRefreshToken(false))
        this.props.dispatch(updateToken(token))
        this.verifyToken(token)
        setTimeout(() => {
            if (!this.props.user.verified && !this.props.user.verificationLimitExceeded) {
                this.props.dispatch(updateRefreshToken(true))
            }
        }, 5000)
    }

    render() {

        return (
            <GoogleReCaptcha onVerify={this.updateToken} refreshReCaptcha={this.props.user.refreshToken}/>
        );
    }
}

export default connect(mapStateToProps)(ReCaptcha)