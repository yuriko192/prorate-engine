import {dialogMode} from "./enums";

export interface ProductDetail {
    Name: string,
    Price: number,
    Weight: number,
}

export interface ProrateResult {
    ProductName: string,
    ProductPrice: number,
    Weight: number,
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