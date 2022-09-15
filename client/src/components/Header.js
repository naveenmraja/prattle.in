import {Component} from "react";
import {AppBar, Chip, CssBaseline, FormControl, Grid, Link, Toolbar} from "@mui/material";
import {connect} from "react-redux";
import {Circle} from "@mui/icons-material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import * as Constants from "../utils/Constants";
import {socket} from "../utils/Constants";
import {updateOnlineUsers} from "../features/user/PrattleSlice";

function mapStateToProps(state) {
    return {
        onlineUsers: state.prattle.ui.onlineUsers
    }
}

const theme = createTheme({palette: {mode: 'dark'}});

class Header extends Component {

    componentDidMount() {
        this.getOnlineUsers()
        socket.on(Constants.EVENT_GET_ONLINE_USERS, (message) => {
            this.props.dispatch(updateOnlineUsers(message.onlineUsers))
            setTimeout(this.getOnlineUsers, 5000)
        })
    }

    getOnlineUsers = () => {
        socket.emit(Constants.EVENT_GET_ONLINE_USERS)
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar position="static">
                    <Toolbar>
                        <Grid container>
                            <Grid item xs={6} sx={{mt: 1}}>
                                <Link href={"/"} underline="none">
                                    <img src={"/prattle-logo.png"} alt={"Prattle"}/>
                                </Link>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl sx={{mt: 3, mb: 3, float: 'right'}}>
                                    <Chip icon={<Circle fontSize={"xs"}/>}
                                          label={"Online : " + this.props.onlineUsers}
                                          variant="outlined" color={"success"} onClick={this.getOnlineUsers}/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        );
    }
}

export default connect(mapStateToProps)(Header)