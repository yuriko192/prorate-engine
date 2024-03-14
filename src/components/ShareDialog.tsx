import React from "react";
import {Dialog, DialogContent, DialogTitle, Grid, TextField, Typography} from "@mui/material";
import {PaymentDetailCard} from "./PaymentDetailCard";
import {paymentType} from "../enums";
import {PaymentDetails, ShareDialogProps} from "../interface";

export function ShareDialog(props: ShareDialogProps) {
    const payments: Array<PaymentDetails> = [
        {
            type: paymentType.BCA,
            accountNumber: '12345678',
            OtherText: '',
        },
        {
            type: paymentType.JAGO  ,
            accountNumber: '1234567890',
            OtherText: '',
        }
    ]
    return (
        <Dialog onClose={props.onClose} open={props.open} maxWidth={'md'} fullWidth>
            <DialogTitle>SHARE</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} py={'1rem'} alignItems={'center'}>
                    <Grid item xs={2}>
                        <Typography>
                            Biller
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            variant='outlined'
                            type='text'
                            label='DROPDOWN'
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} py={'1rem'}>
                    {payments.map(
                        (payment, idx) => (
                            <Grid item xs={3}>
                                <PaymentDetailCard key={idx} payment={payment}/>
                            </Grid>
                        ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}