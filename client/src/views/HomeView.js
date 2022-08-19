import * as React from 'react';
import { Component } from "react";
import { connect } from "react-redux";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Button,
    Chip,
    CssBaseline,
    Divider,
    Grid, InputAdornment, Link,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/styles";
import {
    addInterest, hideLimitExceededSnackbar,
    hideVerifiedSnackbar,
    removeInterest,
    toggleDisplayTermsAndConditions,
    updateCurrentInterest,
} from "../features/user/PrattleSlice";
import LoadingButton from '@mui/lab/LoadingButton';
import {CancelRounded, InterestsOutlined} from "@mui/icons-material";
import TermsAndConditions from "../components/TermsAndConditions";
import {Link as RouterLink} from 'react-router-dom'
import Loader from "../components/Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ReCaptcha from "../components/ReCaptcha";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function mapStateToProps(state) {
    return {
        user : state.prattle.user,
        ui : state.prattle.ui
    }
}
const theme = createTheme({ palette: { mode: 'dark' } });

const StyledPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    fontSize: "1rem"
}));

class HomeView extends Component {

    constructor(props) {
        super(props);
        this.textFieldRef = React.createRef()
    }

    handleTextInput = (event) => {
        this.props.dispatch(updateCurrentInterest(event.target.value))
    }

    handleAddInterest = (event) => {
        if (event.key === "Enter") {
            this.props.dispatch(addInterest(event.target.value))
        }
    }

    removeInterest = (interest) => {
        this.props.dispatch(removeInterest(interest))
    }

    getInterestChip = (interest) => {
        return (<Chip icon={<InterestsOutlined />} label={interest} variant="outlined" color={"success"}
                      onDelete={() => this.removeInterest(interest)} deleteIcon={<CancelRounded />}
                      sx={{mr:"1%", mt: "1%"}} key={interest}/>)
    }

    getButtonElement = () => {
        if(this.props.user.verified) {
            return (
                <RouterLink to={"/chat"} style={{textDecoration: 'none'}}>
                    <Button fullWidth variant="contained" color={"success"}>
                        Start Chatting
                    </Button>
                </RouterLink>
            )
        } else if(this.props.user.verificationLimitExceeded) {
            return (
                <Button fullWidth variant="contained" disabled>
                    We couldn't verify you through Google. Please try again later !
                </Button>
            )
        } else {
            return (
                <LoadingButton fullWidth variant="contained" loading loadingPosition={"end"}
                               endIcon={<CancelRounded />}>Please wait while we verify you're not a robot
                </LoadingButton>
            )
        }
    }

    closeVerifiedSnackbar = () => {
        this.props.dispatch(hideVerifiedSnackbar())
    }

    closeLimitExceededSnackbar = () => {
        this.props.dispatch(hideLimitExceededSnackbar())
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.user.verified && !prevProps.user.verified) {
            this.textFieldRef.current.focus()
        }
    }

    render() {
        const interestTags = this.props.user.interests.map(this.getInterestChip)
        const buttonElement = this.getButtonElement()
        return(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Loader showLoader = {this.props.ui.showLoader}/>
                <Snackbar open={this.props.ui.showVerifiedSnackbar} autoHideDuration={5000} onClose={this.closeVerifiedSnackbar}>
                    <Alert onClose={this.closeVerifiedSnackbar} severity="success" sx={{ width: '100%' }}>
                        User verified by Google!
                    </Alert>
                </Snackbar>
                <Snackbar open={this.props.ui.showLimitExceededSnackbar} autoHideDuration={20000} onClose={this.closeLimitExceededSnackbar}>
                    <Alert onClose={this.closeLimitExceededSnackbar} severity="error" sx={{ width: '100%' }}>
                        Sorry, we couldn't verify you through Google at this time. Please try again later !
                    </Alert>
                </Snackbar>
                <Grid container spacing={2} sx={{flexGrow: 1, height: "100%"}}>
                    <Grid item sx={{width: "100%", ml: "5%", mr: "5%", mt: "1%"}}>
                        <StyledPaper sx={{padding: "10px"}}>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    <b>{`You don't need an app to use Prattle on your phone or tablet ! 
                                    Prattle is designed to be responsive and works great on all devices.`}</b>
                                </Typography>
                            </Grid>
                            <Divider/>
                            <Grid sx={{m: "2%"}}>
                                Prattle is a great way to meet new people. To help you stay safe, the chats are
                                completely anonymous. Prattle will pick someone random for you and
                                create a private chat session. If you prefer to add your interests, Prattle will
                                look to connect you with someone who shares some of your interests.<br/><br/>

                                By using Prattle, you accept the <Link underline={"none"} href={"#"}
                                                                       onClick={(e) => this.props.dispatch(toggleDisplayTermsAndConditions())}>
                                terms and conditions</Link>.
                                You must be 18+ or 13+
                                with parental permission.
                            </Grid>
                            <Divider/>
                            <Grid sx={{m: "2%"}}>
                                <b>{`What do you wanna chat about?`}</b><br/>
                                {interestTags}
                                <TextField fullWidth sx={{mt: "2%", mb: "2%"}} label="Interests" color={"success"}
                                           value={this.props.ui.currentInterest} onChange={this.handleTextInput}
                                           onKeyPress={this.handleAddInterest}
                                           error={this.props.ui.interestsInputError}
                                           InputProps={{
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <InterestsOutlined color={"success"}/>
                                                   </InputAdornment>
                                               ),
                                           }}
                                           inputRef={this.textFieldRef}
                                           helperText={this.props.ui.interestsInputErrorMessage}
                                           disabled={!this.props.user.verified}
                                           placeholder={"Please add your interests here. You can add up to 10 interests. Press enter to add"} />
                                {buttonElement}
                            </Grid>
                            <Divider/>
                            <Grid sx={{m: "2%"}}>
                                <ul>
                                    <li>Our chat service is free to use and completely anonymous. Your identity is not known unless revealed by you (not suggested).</li>
                                    <li>No registration is required to use our chat service. No more spending time with registration forms !</li>
                                </ul>
                            </Grid>
                        </StyledPaper>
                        <TermsAndConditions />
                        <ReCaptcha />
                    </Grid>
                </Grid>
            </ThemeProvider>
        )
    }
}

export default connect(mapStateToProps)(HomeView)