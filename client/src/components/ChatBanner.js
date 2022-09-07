import { Component } from "react";
import {Card, CardContent, Grid, Typography} from "@mui/material";

class ChatBanner extends Component {

    createMarkup = (markup) => {
        return {__html: markup}
    }

    render() {
        if(!this.props.bannerMessage) {
            return
        }
        const style = {
            maxWidth: "100%",
            backgroundColor: this.props.color ? this.props.color : "dimgrey",
            paddingBotttom: "0px",
            margin: "auto",
            width: "fit-content"
        }
        return (
            <Grid item md={12} xs={12}>
                <Card raised sx={style}>
                    <CardContent >
                        <Typography component={'span'}>
                            <div dangerouslySetInnerHTML={this.createMarkup(this.props.bannerMessage)}/>
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default ChatBanner;