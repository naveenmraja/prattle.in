import {Component} from "react";
import {Button} from "@mui/material";
import {connect} from "react-redux";
import {CancelRounded, CheckRounded, RefreshRounded} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Constants from "../utils/Constants";
import {
    disconnectConversation,
    startNewConversation,
    updateShowConfirmButton,
} from "../features/user/PrattleSlice";

function mapStateToProps(state) {
    return {
        user : state.prattle.user,
        ui : state.prattle.ui
    }
}

class LeftButton extends Component {

    handleDisconnect = (e) => {
        if(this.props.user.status === Constants.STATUS_BUSY) {
            this.props.dispatch(updateShowConfirmButton(true))
        }
    }

    render() {
        if(this.props.ui.showConfirmButton) {
            return (<Button fullWidth variant="contained" color={"error"} sx={{height: "100%"}}
                            onClick={() => this.props.dispatch(disconnectConversation())}>
                <CheckRounded fontSize={"large"}/>
            </Button>)
        } else if(this.props.ui.showRefreshButton) {
            return (<Button fullWidth variant="contained" color={"info"} sx={{height: "100%"}}
                            onClick={() => this.props.dispatch(startNewConversation())}>
                <RefreshRounded fontSize={"large"}/>
            </Button>)
        } else if(this.props.ui.showLoadingButton) {
            return (<LoadingButton sx={{height: "100%"}} fullWidth loading variant="contained" />)
        } else {
            return (<Button fullWidth variant="contained" color={"error"} sx={{height: "100%"}}
                            hidden={this.props.ui.showConfirmButton || this.props.ui.showRefreshButton}
                            onClick={this.handleDisconnect}>
                <CancelRounded fontSize={"large"}/>
            </Button>)
        }
    }
}

export default connect(mapStateToProps)(LeftButton)