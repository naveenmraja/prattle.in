import { Component } from "react";
import {Card, CardContent, Grid, Typography} from "@mui/material";

class MessageCard extends Component {

    render() {
        const socketId = this.props.socketId
        const style = {
            maxWidth: "50%",
            paddingBotttom: "0px",
            width: "fit-content",
            whiteSpace: "pre-wrap"
        }
        if(this.props.message.socketId === socketId) {
            style.backgroundColor = "gray"
            style.float = "right"
            style.mr = "1%"
        } else {
            style.backgroundColor = "#388e3c"
            style.float = "left"
            style.ml = "1%"
        }
        return (
            <Grid item md={12} xs={12} key={`chat-message-${this.props.index}`}>
                <Card raised sx={style}>
                    <CardContent >
                        <Typography>
                            {this.props.message.content}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
}

export default MessageCard;