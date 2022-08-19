import { Component } from "react";
import {Divider, Grid, Modal, Paper, Typography} from "@mui/material";
import {connect} from "react-redux";
import {toggleDisplayTermsAndConditions} from "../features/user/PrattleSlice";
import {styled} from "@mui/styles";

function mapStateToProps(state) {
    return {
        displayTermsAndConditions : state.prattle.ui.displayTermsAndConditions
    }
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    fontSize: "1rem"
}));

const style = {
    flexGrow: 1,
    height: "100%",
    overflow: "scroll",
    width: "80%",
    mt: "1%",
    ml: "10%",
    mr: "10%"
}

class TermsAndConditions extends Component {
    render() {
        const handleClose = () => {
            this.props.dispatch(toggleDisplayTermsAndConditions())
        }
        return (
            <Modal
                open={this.props.displayTermsAndConditions}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Grid container spacing={2} sx={style}>
                    <Grid item sx={{width: "100%"}}>
                        <StyledPaper sx={{padding: "10px"}}>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    <b>Terms and Conditions ("Terms")</b>
                                </Typography>
                            </Grid>
                            <Divider/>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    Last updated: August 15, 2022 <br/><br/>
                                    Please read these Terms and Conditions ("Terms", "Terms and Conditions")
                                    carefully before using the https://www.prattle.in website (the "Service")
                                    operated by Prattle ("us", "we", or "our").<br/><br/>
                                    Your access to and use of the Service is conditioned on your acceptance of and
                                    compliance with these Terms. These Terms apply to all visitors, users and others
                                    who access or use the Service.<br/><br/>
                                    By accessing or using the Service you agree to be bound by these Terms.
                                    If you disagree with any part of the terms then you may not access the Service.
                                    This Terms & Conditions agreement is licensed by TermsFeed to Prattle.
                                </Typography>
                            </Grid>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    <b>Links To Other Web Sites</b><br/><br/>
                                    Our Service may contain links to third-party web sites or services that are
                                    not owned or controlled by Prattle.<br/><br/>
                                    Prattle has no control over, and assumes no responsibility for, the content,
                                    privacy policies, or practices of any third party web sites or services.
                                    You further acknowledge and agree that Prattle shall not be responsible or liable,
                                    directly or indirectly, for any damage or loss caused or alleged to be caused by or in
                                    connection with use of or reliance on any such content, goods or services available on or
                                    through any such eb sites or services.<br/><br/>
                                    We strongly advise you to read the terms and conditions and privacy policies of any third-party
                                    web sites or services that you visit.<br/><br/>
                                </Typography>
                            </Grid>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    <b>Termination</b><br/><br/>
                                    We may terminate or suspend access to our Service immediately, without prior notice
                                    or liability, for any reason whatsoever, including without limitation if you breach
                                    the Terms.<br/><br/>
                                    All provisions of the Terms which by their nature should survive termination shall
                                    survive termination, including, without limitation, ownership provisions, warranty
                                    disclaimers, indemnity and limitations of liability.<br/><br/>
                                </Typography>
                            </Grid>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    <b>Governing Law</b><br/><br/>
                                    These Terms shall be governed and construed in accordance with the laws of
                                    Tamil Nadu, India, without regard to its conflict of law provisions.<br/><br/>
                                    Our failure to enforce any right or provision of these Terms will not be considered a
                                    waiver of those rights. If any provision of these Terms is held to be invalid or
                                    unenforceable by a court, the remaining provisions of these Terms will remain in
                                    effect. These Terms constitute the entire agreement between us regarding our Service,
                                    and supersede and replace any prior agreements we might have between us regarding the
                                    Service.<br/><br/>
                                </Typography>
                            </Grid>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    <b>Changes</b><br/><br/>
                                    We reserve the right, at our sole discretion, to modify or replace these Terms at
                                    any time. If a revision is material we will try to provide at least 30 days notice
                                    prior to any new terms taking effect. What constitutes a material change will be
                                    determined at our sole discretion.<br/><br/>
                                    By continuing to access or use our Service after those revisions become effective,
                                    you agree to be bound by the revised terms. If you do not agree to the new terms,
                                    please stop using the Service.<br/><br/>
                                </Typography>
                            </Grid>
                            <Grid sx={{m: "2%"}}>
                                <Typography>
                                    <b>Contact Us</b><br/><br/>
                                    If you have any questions about these Terms, please contact us.<br/><br/>
                                </Typography>
                            </Grid>
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Modal>
        )
    }
}

export default connect(mapStateToProps)(TermsAndConditions)