import {dialogMode, paymentType} from "./enums";

export interface ProductDetail {
    Selected: boolean,
    Name: string,
    Price: number,
    Quantity: number,
    ProratedPrice: number,
}

export interface onCloseItemDialogParam {
    mode: dialogMode,
    index: number,
    productDetail: ProductDetail,
}

export interface AddItemDialogProps {
    open: boolean;
    onClose: (param?: onCloseItemDialogParam) => void;
    mode: dialogMode,
    index?: number,
    productDetail?: ProductDetail,
}

export interface ShareDialogProps {
    open: boolean;
    onClose: () => void;

}

export interface PaymentDetails {
    type: paymentType
    accountNumber:string,
    OtherText:string
}