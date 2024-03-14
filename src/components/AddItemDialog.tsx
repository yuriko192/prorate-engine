import React from "react";
import {Button, Dialog, DialogContent, DialogTitle, List, ListItem, TextField} from "@mui/material";
import {AddItemDialogProps} from "../interface";
import {dialogMode} from "../enums";

export function AddItemDialog(props: AddItemDialogProps) {
    const {onClose, open} = props;
    const [clickedSubmit, setClickedSubmitStatus] = React.useState(false);
    const [productName, setProductName] = React.useState("");
    const [productPrice, setProductPrice] = React.useState(0);
    const [productWeight, setProductWeight] = React.useState(1);
    const [isEditDataPreserved, setIsEditDataPreserved] = React.useState(false);

    const setStateToDefault = () => {
        setProductName("");
        setProductPrice(0);
        setProductWeight(1);
        setClickedSubmitStatus(false);
        setIsEditDataPreserved(false);
    }

    const handleClose = () => {
        onClose();
        setStateToDefault();
    };

    const handleSubmit = () => {
        if (productName === "" || productPrice <= 0 || productWeight <= 0) {
            setClickedSubmitStatus(true)
            return
        }

        onClose({
            mode: props.mode,
            index: props.index as number,
            productDetail: {
                Name: productName,
                Price: productPrice,
                Quantity: productWeight,
            },
        });

        setStateToDefault();
    };

    if (props.mode == dialogMode.EDIT && !isEditDataPreserved) {
        setProductName(props.productDetail?.Name as string);
        setProductPrice(props.productDetail?.Price as number);
        setProductWeight(props.productDetail?.Quantity as number);
        setIsEditDataPreserved(true);
    }

    return (
        <Dialog onClose={handleClose} open={open} maxWidth={'md'} fullWidth>
            <DialogTitle>{props.mode == dialogMode.ADD ? 'Add product' : props.mode == dialogMode.EDIT ? 'Edit product' : 'Invalid mode'}</DialogTitle>
            <DialogContent>
                <List>
                    <ListItem disableGutters>
                        <TextField
                            value={productName ?? ''}
                            required
                            variant='outlined'
                            type='text'
                            label='Product Name'
                            fullWidth
                            error={clickedSubmit && productName === ""}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setProductName(event.target.value);
                            }}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            value={(!productPrice || productPrice == 0) ? '' : productPrice}
                            required
                            variant='outlined'
                            type='number'
                            label='Price'
                            fullWidth
                            error={clickedSubmit && productPrice <= 0}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (!event.target.valueAsNumber) {
                                    setProductPrice(0);
                                    return
                                }

                                setProductPrice(event.target.valueAsNumber);
                            }}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <TextField
                            value={(!productWeight || productWeight == 0) ? '' : productWeight}
                            required
                            variant='outlined'
                            type='number'
                            label='Quantity'
                            fullWidth
                            error={clickedSubmit && productWeight <= 0}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (!event.target.valueAsNumber) {
                                    setProductWeight(0);
                                    return
                                }

                                setProductWeight(event.target.valueAsNumber);
                            }}
                        />
                    </ListItem>
                    <ListItem disableGutters>
                        <Button variant='contained' fullWidth sx={{minHeight: 50}}
                                onClick={handleSubmit}>{props.mode == dialogMode.ADD ? 'Add Product' : 'Edit'}</Button>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
}