import './App.css';
import { AppBar, Button, Container, CssBaseline, Dialog, DialogContent, DialogTitle, Grid, List, ListItem, ListItemButton, Paper, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material'
import React from 'react';
import { Edit as EditIcon, Delete as DeleteIcon, Edit } from '@mui/icons-material'

interface ProductDetail {
  Name: string,
  Price: number,
  Weight: number,
}

interface ProrateResult {
  ProductName: string,
  ProductPrice: number,
  Weight: number,
  FinalPrice: number,
}

enum dialogMode {
  NONE = '',
  ADD = 'ADD',
  EDIT = 'EDIT',
}

interface onCloseParam {
  mode: dialogMode,
  index: number,
  productDetail: ProductDetail,
}

interface SimpleDialogProps {
  open: boolean;
  onClose: (param?: onCloseParam) => void;
  mode: dialogMode,
  index?: number,
  productDetail?: ProductDetail,
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;
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
        Weight: productWeight,
      },
    });

    setStateToDefault();
  };

  if (props.mode == dialogMode.EDIT && !isEditDataPreserved) {
    setProductName(props.productDetail?.Name as string);
    setProductPrice(props.productDetail?.Price as number);
    setProductWeight(props.productDetail?.Weight as number);
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
              variant='filled'
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
              variant='filled'
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
              variant='filled'
              type='number'
              label='Weight'
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
            <Button variant='contained' fullWidth sx={{ minHeight: 50 }} onClick={handleSubmit}>{props.mode == dialogMode.ADD ? 'Add Product' : 'Edit'}</Button>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
}

function App() {
  const [open, setOpen] = React.useState(false);
  const [productList, setProductList] = React.useState<Array<ProductDetail>>([])
  const [discountAmount, setDiscountAmount] = React.useState(0)
  const [otherFee, setOtherFee] = React.useState(0)
  const [dialogModeState, setDialogMode] = React.useState<dialogMode>(dialogMode.NONE)
  const [dialogProductDetail, setDialogProductDetail] = React.useState<ProductDetail>()
  const [dialogIndex, setDialogIndex] = React.useState(0)

  const currFormatter = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'})

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
        Weight: param.productDetail.Weight,
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
            Weight: param.productDetail.Weight,
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
    totalWeight += eachProduct.Weight
    totalProductPrice += eachProduct.Price
    prorateDataResult.push({
      ProductName: eachProduct.Name,
      ProductPrice: eachProduct.Price,
      Weight: eachProduct.Weight,
      FinalPrice: 0,
    })
  })

  prorateDataResult.forEach((eachDataResult, idx) => {
    eachDataResult.FinalPrice = eachDataResult.ProductPrice

    if (discountAmount > 0) {
      eachDataResult.FinalPrice = eachDataResult.ProductPrice - (eachDataResult.ProductPrice / totalProductPrice * discountAmount)
    }

    if (otherFee > 0) {
      eachDataResult.FinalPrice += (otherFee * eachDataResult.Weight / totalWeight)
    }

    totalFinalPrice += eachDataResult.FinalPrice
    prorateDataResult[idx] = eachDataResult
  })


  return (
    <React.Fragment>
      <CssBaseline />
      <Grid container height={'100vh'} direction={'column'}>
        <Grid item>
          <AppBar
            position='absolute'
            color='default'
            elevation={0}
            sx={{
              position: 'relative',
              borderBottom: (t) => `1px solid ${t.palette.divider}`
            }}
          >
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                Prorate Engine
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item flex={1} sx={{ py: 2, }} >
          <Container maxWidth="md" sx={{ height: '100%', p: { xs: 0 } }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
              <Grid container direction={'column'} columnSpacing={1} rowSpacing={1} sx={{ height: '100%' }}>
                <Grid item container justifyContent={'space-between'} columnSpacing={1} rowSpacing={1}>
                  <Grid item xs={12} md={6}>
                    <TextField value={(!discountAmount || discountAmount <= 0) ? '' : discountAmount} variant='filled' type='number' label='Discount amount' fullWidth
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
                    <TextField value={(!otherFee || otherFee <= 0) ? '' : otherFee} variant='filled' type='number' label='Other fee' fullWidth
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
                  <Grid item flex={1} sx={{ overflowY: 'auto' }} flexBasis={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product Name</TableCell>
                          <TableCell align='center'>Price</TableCell>
                          <TableCell align='center'>Weight</TableCell>
                          <TableCell align='center'>Final Price (each)</TableCell>
                          <TableCell align='center'>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody sx={{ overflowY: 'auto' }}>
                        {
                          prorateDataResult.map(
                            (product, idx) =>
                              <TableRow key={idx}>
                                <TableCell>{product.ProductName}</TableCell>
                                <TableCell align='center'>{currFormatter.format(product.ProductPrice)}</TableCell>
                                <TableCell align='center'>{product.Weight}</TableCell>
                                <TableCell align='center'>{currFormatter.format(product.FinalPrice)} <a style={{fontSize: 12, color: 'green', fontWeight: 'bold'}}>({currFormatter.format(product.FinalPrice/product.Weight)})</a></TableCell>
                                <TableCell align='center'>
                                  <Grid container columnSpacing={1} rowSpacing={1} justifyContent={'center'}>
                                    <Grid item>
                                      <Button variant="contained" onClick={e => { handleClickEdit(idx)}}><EditIcon /></Button>
                                    </Grid>
                                    <Grid item>
                                      <Button variant="contained" color='error' onClick={e => { handleDelete(idx) }}><DeleteIcon /></Button>
                                    </Grid>
                                  </Grid>
                                </TableCell>
                              </TableRow>
                          )
                        }
                      </TableBody>
                      <TableFooter sx={{ position: 'sticky' }}>
                        <TableRow>
                          <TableCell>Total</TableCell>
                          <TableCell align='center'>{currFormatter.format(totalProductPrice)}</TableCell>
                          <TableCell align='center'>{totalWeight}</TableCell>
                          <TableCell align='center'>{currFormatter.format(totalFinalPrice)}</TableCell>
                          <TableCell align='center'>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </Grid>
                  <Grid item>
                    <Button variant='contained' fullWidth sx={{ minHeight: 50 }} onClick={handleClickOpen}>Add Product</Button>
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

export default App;
