import React from "react";
import {onCloseParam, ProductDetail, ProrateResult} from "./interface";
import {dialogMode} from "./enums";
import {
    AppBar,
    Button,
    Container,
    Grid, Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography, useTheme
} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {Delete as DeleteIcon, Edit as EditIcon} from "@mui/icons-material";
import {SimpleDialog} from "./components/SimpleDialog";
import {ColorModeContext} from "./context";
import {currFormatter} from "./utils";


function Home() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    const [open, setOpen] = React.useState(false);
    const [productList, setProductList] = React.useState<Array<ProductDetail>>([])
    const [discountAmount, setDiscountAmount] = React.useState(0)
    const [otherFee, setOtherFee] = React.useState(0)
    const [dialogModeState, setDialogMode] = React.useState<dialogMode>(dialogMode.NONE)
    const [dialogProductDetail, setDialogProductDetail] = React.useState<ProductDetail>()
    const [dialogIndex, setDialogIndex] = React.useState(0)

    const handleClickOpen = () => {
        setOpen(true);
        setDialogMode(dialogMode.ADD)
    };

    const handleClickEdit = (idx: number) => {
        if (productList.length <= idx) {
            return
        }

        setOpen(true)
        setDialogMode(dialogMode.EDIT)
        setDialogIndex(idx)
        setDialogProductDetail(productList[idx])
    }

    const handleDelete = (idx: number) => {
        setProductList(productList.filter((product, productIdx) => productIdx != idx))
    }

    const handleClose = (param?: onCloseParam) => {
        setOpen(false);
        setDialogProductDetail(undefined);
        setDialogMode(dialogMode.NONE);

        if (!param || param.mode == dialogMode.NONE) {
            return
        }

        if (param.mode == dialogMode.ADD) {
            setProductList([...productList, {
                Name: param.productDetail.Name,
                Price: param.productDetail.Price,
                Quantity: param.productDetail.Quantity,
            }])
            return
        }

        if (param.mode == dialogMode.EDIT) {
            let newProductList = new Array<ProductDetail>
            productList.forEach((eachProduct, productIdx) => {
                if (param.index == productIdx) {
                    newProductList.push({
                        Name: param.productDetail.Name,
                        Price: param.productDetail.Price,
                        Quantity: param.productDetail.Quantity,
                    })
                    return
                }
                newProductList.push(eachProduct)
            })
            setProductList(newProductList)
        }
    };

    let prorateDataResult = new Array<ProrateResult>,
        totalProductPrice = 0,
        totalWeight = 0,
        totalFinalPrice = 0

    productList.forEach((eachProduct) => {
        totalWeight += eachProduct.Quantity
        totalProductPrice += eachProduct.Price
        prorateDataResult.push({
            ProductName: eachProduct.Name,
            ProductPrice: eachProduct.Price,
            Quantity: eachProduct.Quantity,
            FinalPrice: 0,
        })
    })

    prorateDataResult.forEach((eachDataResult:ProrateResult, idx:number) => {
        eachDataResult.FinalPrice = eachDataResult.ProductPrice

        if (discountAmount > 0) {
            eachDataResult.FinalPrice = eachDataResult.ProductPrice - (eachDataResult.ProductPrice / totalProductPrice * discountAmount)
        }

        if (otherFee > 0) {
            eachDataResult.FinalPrice += (otherFee * eachDataResult.Quantity / totalWeight)
        }

        totalFinalPrice += eachDataResult.FinalPrice
        prorateDataResult[idx] = eachDataResult
    })


    return (
        <React.Fragment>
            <Grid container height={'100vh'} direction={'column'}>
                <Grid item>
                    <AppBar
                        color='default'
                        elevation={0}
                        sx={{
                            position: 'relative',
                            borderBottom: (t) => `1px solid ${t.palette.divider}`
                        }}
                    >
                        <Toolbar
                            sx={{
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography variant="h6" color="inherit" noWrap>
                                Prorate Engine
                            </Typography>
                            <Button sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit">
                                {theme.palette.mode} mode {theme.palette.mode === 'dark' ? <Brightness7Icon/> :
                                <Brightness4Icon/>}
                            </Button>
                        </Toolbar>
                    </AppBar>
                </Grid>
                <Grid item flex={1} sx={{py: 2,}}>
                    <Container maxWidth="md" sx={{height: '100%', p: {xs: 0}}}>
                        <Paper variant="outlined" sx={{p: {xs: 2, md: 3}, height: '100%'}}>
                            <Grid container direction={'column'} columnSpacing={1} rowSpacing={1} sx={{height: '100%'}}>
                                <Grid item container justifyContent={'space-between'} columnSpacing={1} rowSpacing={1}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            value={(!discountAmount || discountAmount <= 0) ? '' : discountAmount}
                                            variant='outlined' type='number' label='Discount amount' fullWidth
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                if (!event.target.valueAsNumber) {
                                                    setDiscountAmount(0)
                                                    return
                                                }

                                                setDiscountAmount(event.target.valueAsNumber);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField value={(!otherFee || otherFee <= 0) ? '' : otherFee} variant='outlined'
                                                   type='number' label='Other fee' fullWidth
                                                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                       if (!event.target.valueAsNumber) {
                                                           setOtherFee(0)
                                                           return
                                                       }

                                                       setOtherFee(event.target.valueAsNumber);
                                                   }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container flex={1} direction={'column'} columnSpacing={1} rowSpacing={1}>
                                    <Grid item flex={1} sx={{overflowY: 'auto'}} flexBasis={0}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product Name</TableCell>
                                                    <TableCell align='center'>Price</TableCell>
                                                    <TableCell align='center'>Quantity</TableCell>
                                                    <TableCell align='center'>Final Price (each)</TableCell>
                                                    <TableCell align='center'>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{overflowY: 'auto'}}>
                                                {
                                                    prorateDataResult.map(
                                                        (product, idx) =>
                                                            <TableRow key={idx}>
                                                                <TableCell>{product.ProductName}</TableCell>
                                                                <TableCell
                                                                    align='center'>{currFormatter.format(product.ProductPrice)}</TableCell>
                                                                <TableCell align='center'>{product.Quantity}</TableCell>
                                                                <TableCell
                                                                    align='center'>{currFormatter.format(product.FinalPrice)}
                                                                    <a style={{
                                                                        fontSize: 12,
                                                                        color: 'green',
                                                                        fontWeight: 'bold'
                                                                    }}>({currFormatter.format(product.FinalPrice / product.Quantity)})</a></TableCell>
                                                                <TableCell align='center'>
                                                                    <Grid container columnSpacing={1} rowSpacing={1}
                                                                          justifyContent={'center'}>
                                                                        <Grid item>
                                                                            <Button variant="contained" onClick={e => {
                                                                                handleClickEdit(idx)
                                                                            }}><EditIcon/></Button>
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <Button variant="contained" color='error'
                                                                                    onClick={e => {
                                                                                        handleDelete(idx)
                                                                                    }}><DeleteIcon/></Button>
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                            </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                            <TableFooter sx={{position: 'sticky'}}>
                                                <TableRow>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell
                                                        align='center'>{currFormatter.format(totalProductPrice)}</TableCell>
                                                    <TableCell align='center'>{totalWeight}</TableCell>
                                                    <TableCell
                                                        align='center'>{currFormatter.format(totalFinalPrice)}</TableCell>
                                                    <TableCell align='center'>
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </Grid>
                                    <Grid item>
                                        <Button variant='contained' fullWidth sx={{minHeight: 50}}
                                                onClick={handleClickOpen}>Add Product</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Container>
                </Grid>
            </Grid>
            <SimpleDialog
                open={open}
                onClose={handleClose}
                mode={dialogModeState}
                productDetail={dialogProductDetail}
                index={dialogIndex}
            />
        </React.Fragment>
    );
}

export default Home;