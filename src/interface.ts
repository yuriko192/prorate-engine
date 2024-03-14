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