import React from "react";
import {onCloseItemDialogParam, ProductDetail} from "./interface";
import {dialogMode, themeMode} from "./enums";
import {
    AppBar, Box,
    Button, Checkbox,
    Container, Drawer,
    Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {Delete as DeleteIcon, Edit as EditIcon} from "@mui/icons-material";
import {AddItemDialog} from "./components/AddItemDialog";
import {ColorModeContext} from "./context";
import {currFormatter, GetLocalStorage, RemoveLocalStorage, SetLocalStorageWithExpiry} from "./utils";
import {
    DefaultLocalStorageExpiry,
    EnableShareFunc,
    LocalDiscountAmtKey,
    LocalFeeAmtKey,
    LocalItemListKey, LocalThemeKey
} from "./const";
import {ShareDialog} from "./components/ShareDialog";
import './Home.scss';


function Home() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    const [isOpenShareDialog, setIsOpenShareDialog] = React.useState(false);
    const [isOpenAddItemDialog, setIsOpenAddItemDialog] = React.useState(false);
    const [isOpenSidebar, setIsOpenSidebar] = React.useState(false);

    const [productList, setProductList] = React.useState<Array<ProductDetail>>(GetLocalStorage(LocalItemListKey) ?? [])
    const [discountAmount, setDiscountAmount] = React.useState(GetLocalStorage(LocalDiscountAmtKey) ?? 0)
    const [otherFee, setOtherFee] = React.useState(GetLocalStorage(LocalFeeAmtKey) ?? 0)
    const [isSelectAll, setSelectAll] = React.useState(productList.length > 0 ? productList.every(product => product.Selected) : false)

    const [dialogModeState, setDialogMode] = React.useState<dialogMode>(dialogMode.NONE)
    const [dialogProductDetail, setDialogProductDetail] = React.useState<ProductDetail>()
    const [dialogIndex, setDialogIndex] = React.useState(0)

    const handleCloseShare = () => {
        setIsOpenShareDialog(false)
    }

    const handleOpenShare = () => {
        setIsOpenShareDialog(true)
    }

    const handleClickOpen = () => {
        setIsOpenAddItemDialog(true);
        setDialogMode(dialogMode.ADD)
    };

    const handleClickEdit = (idx: number) => {
        if (productList.length <= idx) {
            return
        }

        setIsOpenAddItemDialog(true)
        setDialogMode(dialogMode.EDIT)
        setDialogIndex(idx)
        setDialogProductDetail(productList[idx])
    }

    const handleClear = () => {
        localStorage.clear()
        localStorage.setItem(LocalThemeKey, theme.palette.mode)
        setProductList([])
        setDiscountAmount(0)
        setOtherFee(0)
    }

    const handleDelete = (idx: number) => {
        setProductList(productList.filter((product, productIdx) => productIdx != idx))
    }

    const handleClose = (param?: onCloseItemDialogParam) => {
        setIsOpenAddItemDialog(false);
        setDialogProductDetail(undefined);
        setDialogMode(dialogMode.NONE);

        if (!param || param.mode == dialogMode.NONE) {
            return
        }

        if (param.mode == dialogMode.ADD) {
            setProductList([...productList, {
                Selected: false,
                Name: param.productDetail.Name,
                Price: param.productDetail.Price,
                Quantity: param.productDetail.Quantity,
                ProratedPrice: param.productDetail.ProratedPrice,
            }])
            setSelectAll(false)
            return
        }

        if (param.mode == dialogMode.EDIT) {
            let newProductList = productList.map((product, index) => (
                index === param.index ? {
                    Selected: false,
                    Name: param.productDetail.Name,
                    Price: param.productDetail.Price,
                    Quantity: param.productDetail.Quantity,
                    ProratedPrice: param.productDetail.ProratedPrice,
                } : product
            ));
            setProductList(newProductList)
        }
    };

    let handleRemoveSelected = () => {
        setSelectAll(false)
        setProductList(productList.filter((product) => !product.Selected))
    };

    let handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        const updatedProductList = productList.map(product => ({
            ...product,
            Selected: checked
        }));
        setSelectAll(checked)
        setProductList(updatedProductList)
    };

    const handleSelectProduct = (idx: number) => {
        return () => {
            const updatedProductList = productList.map((product, index) => (
                index === idx ? {...product, Selected: !product.Selected} : product
            ));
            setSelectAll(updatedProductList.every(product => product.Selected))
            setProductList(updatedProductList)
        }
    };

    let totalProductPrice = 0,
        totalWeight = 0,
        totalFinalPrice = 0

    SetLocalStorageWithExpiry(LocalItemListKey, productList, DefaultLocalStorageExpiry)
    productList.forEach((eachProduct) => {
        totalWeight += eachProduct.Quantity
        totalProductPrice += eachProduct.Price
    })

    productList.forEach((eachDataResult: ProductDetail, idx: number) => {
        eachDataResult.ProratedPrice = eachDataResult.Price

        if (discountAmount > 0) {
            eachDataResult.ProratedPrice = eachDataResult.Price - (eachDataResult.Price / totalProductPrice * discountAmount)
        }

        if (otherFee > 0) {
            eachDataResult.ProratedPrice += (otherFee * eachDataResult.Quantity / totalWeight)
        }

        totalFinalPrice += eachDataResult.ProratedPrice
    })
    const toggleDrawer = (newOpen: boolean) => () => {
        setIsOpenSidebar(newOpen);
    };

    const DrawerList = (
        <Box sx={{width: 250}} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem
                >
                    <ListItemButton onClick={toggleDrawer(false)}>
                        <MenuOpenIcon/>
                        <ListItemText primary={"Prorate Engine"} sx={{ml: 3}}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );


    return (
        <React.Fragment>
            <div className="MainContainer">
                <Toolbar
                >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" flexGrow={1} noWrap>
                        Prorate Engine
                    </Typography>
                    <Button sx={{ml: 1}} onClick={handleClear} variant={'contained'} color="error">
                        <DeleteIcon/> Clear
                    </Button>
                    <Button sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode} mode {theme.palette.mode === themeMode.DARK ? <Brightness7Icon/> :
                        <Brightness4Icon/>}
                    </Button>
                </Toolbar>
                <div className="ContentContainer">
                    <Container maxWidth="md" sx={{height: '100%', p: {xs: 0}}}>
                        <Paper elevation={3} sx={{p: {xs: 2, md: 3}, height: '100%'}} square={false}>
                            <Grid container direction={'column'} columnSpacing={1} rowSpacing={1}
                                  sx={{height: '100%'}}>
                                <Grid item container justifyContent={'space-between'} columnSpacing={1}
                                      rowSpacing={1}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            value={(!discountAmount || discountAmount <= 0) ? '' : discountAmount}
                                            variant='outlined' type='number' label='Discount amount' fullWidth
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                const val = event.target.valueAsNumber ?? 0
                                                SetLocalStorageWithExpiry(LocalDiscountAmtKey, val, DefaultLocalStorageExpiry)
                                                setDiscountAmount(val);

                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField value={(!otherFee || otherFee <= 0) ? '' : otherFee}
                                                   variant='outlined'
                                                   type='number' label='Other fee' fullWidth
                                                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                       const val = event.target.valueAsNumber ?? 0
                                                       SetLocalStorageWithExpiry(LocalFeeAmtKey, val, DefaultLocalStorageExpiry)
                                                       setOtherFee(val);
                                                   }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container flex={1} direction={'column'} columnSpacing={1} rowSpacing={1}>
                                    <Grid item flex={1} sx={{overflowY: 'auto'}} flexBasis={0}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><Checkbox onChange={handleSelectAll}
                                                                         checked={isSelectAll}/> </TableCell>
                                                    <TableCell>Product Name</TableCell>
                                                    <TableCell align='center'>Price</TableCell>
                                                    <TableCell align='center'>Quantity</TableCell>
                                                    <TableCell align='center'>Final Price (each)</TableCell>
                                                    <TableCell align='center'>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody sx={{overflowY: 'auto'}}>
                                                {
                                                    productList.map(
                                                        (product, idx) =>
                                                            <TableRow key={idx}>
                                                                <TableCell><Checkbox checked={product.Selected}
                                                                                     onChange={handleSelectProduct(idx)}/>
                                                                </TableCell>
                                                                <TableCell>{product.Name}</TableCell>
                                                                <TableCell
                                                                    align='center'>{currFormatter.format(product.Price)}</TableCell>
                                                                <TableCell
                                                                    align='center'>{product.Quantity}</TableCell>
                                                                <TableCell
                                                                    align='center'>{currFormatter.format(product.ProratedPrice)}
                                                                    <a style={{
                                                                        fontSize: 12,
                                                                        color: 'green',
                                                                        fontWeight: 'bold'
                                                                    }}>({currFormatter.format(product.ProratedPrice / product.Quantity)})</a></TableCell>
                                                                <TableCell align='center'>
                                                                    <Grid container columnSpacing={1} rowSpacing={1}
                                                                          justifyContent={'center'}>
                                                                        <Grid item>
                                                                            <IconButton
                                                                                onClick={e => {
                                                                                    handleClickEdit(idx)
                                                                                }}><EditIcon/></IconButton>
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <IconButton
                                                                                color='error'
                                                                                onClick={e => {
                                                                                    handleDelete(idx)
                                                                                }}><DeleteIcon/></IconButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                            </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                            <TableFooter sx={{position: 'sticky'}}>
                                                <TableRow>
                                                    <TableCell>
                                                        <IconButton color='error' onClick={handleRemoveSelected}
                                                                    disabled={!productList.some(product => product.Selected)}>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </TableCell>

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
                                    <Grid item container spacing={2}>
                                        <Grid item xs>
                                            <Button variant='contained' fullWidth sx={{minHeight: 50}}
                                                    onClick={handleClickOpen}>Add Product</Button>
                                        </Grid>
                                        {EnableShareFunc ?
                                            <Grid item xs={4}>
                                                <Button variant={'outlined'} fullWidth sx={{minHeight: 50}}
                                                        onClick={handleOpenShare}>Share</Button>
                                            </Grid>
                                            : <></>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Container>
                </div>
                <div className={`Fixed Background ${theme.palette.mode}`}>
                    <div className="appbar"></div>
                    <div className="custom-shape-divider-top-1710167091">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                             preserveAspectRatio="none">
                            <path
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                opacity=".25" className="shape-fill"></path>
                            <path
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                opacity=".5" className="shape-fill"></path>
                            <path
                                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                                className="shape-fill"></path>
                        </svg>
                    </div>
                    <div className="custom-shape-divider-bottom-1710166162">
                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                             preserveAspectRatio="none">
                            <path
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                opacity=".25" className="shape-fill"></path>
                            <path
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                                opacity=".5" className="shape-fill"></path>
                            <path
                                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                                className="shape-fill"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <Drawer open={isOpenSidebar} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            <AddItemDialog
                open={isOpenAddItemDialog}
                onClose={handleClose}
                mode={dialogModeState}
                productDetail={dialogProductDetail}
                index={dialogIndex}
            />
            {EnableShareFunc ?
                <ShareDialog
                    open={isOpenShareDialog}
                    onClose={handleCloseShare}
                ></ShareDialog>
                : <></>
            }
        </React.Fragment>
    );
}

export default Home;