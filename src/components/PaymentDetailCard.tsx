import {Box, Card, CardContent, Typography} from "@mui/material";
import React from "react";
import {PaymentDetails} from "../interface";
import {paymentType} from "../enums";


export function PaymentDetailCard(props: {payment: PaymentDetails}) {
    const IconImg = (Name: string) => {
        switch (Name) {
            case paymentType.BCA:
                return require(`../Img/BCAIcon.png`)
            case paymentType.JAGO:
                return require(`../Img/JagoIcon.png`)
            case paymentType.GOPAY:
                return require(`../Img/GopayIcon.png`)
            case paymentType.DANA:
                return require(`../Img/DanaIcon.png`)
            case paymentType.CASH:
                return require(`../Img/CashIcon.png`)
            case paymentType.OVO:
                return require(`../Img/OVOIcon.png`)
        }
    }
    return <Card>
        <CardContent>
            <Box width={'100%'} height={'3rem'} position={'relative'} overflow={'hidden'} mb={1} textAlign={'center'}>
                {props.payment.type === paymentType.OTHERS ? (
                    <Typography variant={'h5'} color="text.secondary">
                        {props.payment.OtherText}
                    </Typography>
                ) : (
                    <img src={String(IconImg(props.payment.type))} width={'66%'} alt="" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}/>
                )}
            </Box>
            <Typography variant={'subtitle1'} textAlign={"center"}>
                {props.payment.accountNumber}
            </Typography>
        </CardContent>
    </Card>;
}