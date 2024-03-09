import {dialogMode, paymentType} from "./enums";

export interface ProductDetail {
    Name: string,
    Price: number,
    Quantity: number,
}

export interface ProrateResult {
    ProductName: string,
    ProductPrice: number,
    Quantity: number,
    FinalPrice: number,
}

export interface onCloseParam {
    mode: dialogMode,
    index: number,
    productDetail: ProductDetail,
}

export interface SimpleDialogProps {
    open: boolean;
    onClose: (param?: onCloseParam) => void;
    mode: dialogMode,
    index?: number,
    productDetail?: ProductDetail,
}

export interface PaymentDetails {
    type: paymentType
    accountNumber:string,
    OtherText:string
}