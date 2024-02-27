import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { makeStyles } from "@mui/styles";
import { serverURL,getData,postData } from "../services/ServerServices";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Grid,
  TextField,
  Button,
  Select,
  FormHelperText,
} from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import UploadFile from "@mui/icons-material/UploadFile";
import Swal from "sweetalert2";


import Heading from "../components/Heading/Heading";



const useStyles = makeStyles({
  root: {
    width: "auto",
    height: "auto",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  rootdisplay: {
    width: "auto",
    height: "100vh",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  boxdisplay: {
    width: "80%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding: 15,
  },

  box: {
    width: "70%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding: 15,
  },
  center:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }
});
export default function DisplayAllProduct() {
    
  const admin = JSON.parse(localStorage.getItem('ADMIN'))
  console.log(admin);

  var classes = useStyles();
  var navigate=useNavigate()

  const [listProduct, setListProduct] = useState([]);
  const [open, setOpen] = useState(false);
  ////////////  Data /////////////////////


const [productId, setProductId] = useState(admin.productid);
 




  const [showPassword, setShowPassword] = useState(false);

  const [productName, setProductName] = useState("");



  const [emailid, setEmailid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address,setAddress]=useState("")



const [productLogo, setProductLogo] = useState({ url: "", bytes: "" });

  const [deliveryDate, setDeliveryDate] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState([]);

  const [deliveryDateid, setDeliveryDateId] = useState("");
  const [deliveryTimeid, setDeliveryTimeId] = useState("");



  const [password, setPassword] = useState("");
  const [tempFile, setTempFile] = useState({
   
    logo: "",
  });
  const [resError, setResError] = useState({});
  const [btnStatus, setBtnStatus] = useState(false);

  const handleError = (error, input, message) => {
    setResError((prevState) => ({
      ...prevState,
      [input]: { error: error, message: message },
    }));
    console.log("CC", resError);
  };

 



const validation = () => {
    var submitRecord = true;
    if (productName.trim().length == 0) {
      handleError(true, "productName", "Pls Input Product Name");

      submitRecord = false;
    }

    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      handleError(true, "mobileNumber", "Pls Input Correct Mobile Number");

      submitRecord = false;
    }
    if (
      !emailid ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid)
    ) {
      handleError(true, "emailid", "Pls Input Correct Email Address");

      submitRecord = false;
    }

    if (!address) {
      handleError(true, "address", "Pls Input Address");

      submitRecord = false;
    }

    if (!deliveryDateid) {
      handleError(true, "deliveryDateid", "Pls Select Date");

      submitRecord = false;
    }


    if (!password) {
      handleError("password", "Pls Input Password");
      submitRecord = false;
    }

    return submitRecord;
  };


const fetchAllDeliveryDate = async () => {
    var result = await getData("datetime/fetch_all_date");

    setDeliveryDate(result.data);
  };

  useEffect(function () {
    fetchAllDeliveryDate();
  }, []);

  const fillDeliveryDate = () => {
    return deliveryDate.map((item) => {
      return <MenuItem value={item.deliveryDateid}>{item.deliverydate}</MenuItem>;
    });
  };

  const fetchAllDeliveryTime = async (deliveryTimeid) => {
    var body = { deliveryTimeid: deliveryTimeid };
    var result = await postData("datetime/fetch_all_time", body);
    setDeliveryTime(result.data);
  };

  const fillDeliveryTime = () => {
    return deliveryTime.map((item) => {
      return <MenuItem value={item.deliveryTimeid}>{item.deliverytime}</MenuItem>;
    });
  };

  const handleDeliveryDateChange = (event) => {
    setDeliveryDateId(event.target.value);
    fetchAllDeliveryTime(event.target.value);
  };



  const handleLogo = (event) => {
    setProductLogo({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
    setBtnStatus((prev) => ({ ...prev, logo: true }));
  };
  const handleSubmit = async () => {
    var error = validation();
    console.log("After Submit:", resError);
    if (error) {
      var d = new Date();
      var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      var body = {
        productname: productName,
       
    
        emailid: emailid,
        mobileno: mobileNumber,
        address: address,
       
        deliveryDateid: deliveryDateid,
        deliveryTimeid: deliveryTimeid,

      
    
        productid: productId,
      };

      var result = await postData("product/product_edit_data", body);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Product Details",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
        setOpen(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
        setOpen(false);
      }
    }
  };

  /////////////////////////////////////////////////////

  const handleCancel = (imgStatus) => {
   
     if (imgStatus == 1) {
      setBtnStatus((prev) => ({ ...prev, logo: false }));
      setProductLogo({ url: tempFile.logo, bytes: "" });
    }
  };
  const editImage = async (imgStatus) => {
    if (imgStatus == 1) {
      var formData = new FormData();
      formData.append("productid",productId);
      formData.append("productLogo",  productLogo.bytes);
      var result = await postData("product/product_edit_logo", formData);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Product Added",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
          position: "top-end",
          timer: 5000,
          showConfirmButton: false,
          toast: true,
        });
      }

  


      setBtnStatus((prev) => ({ ...prev, logo: false }));
    }
  };

  const editDeleteButton = (imgStatus) => {
    return (
      <div>
        <Button onClick={() => editImage(imgStatus)}>Edit</Button>
        <Button onClick={() => handleCancel(imgStatus)}>Cancel</Button>
      </div>
    );
  };

  const fetchAllProduct = async () => {
    var result = await getData("product/fetch_all_product");
    setListProduct(result.data);
  };

  const handleEdit = (rowData) => {
   
    fetchAllDeliveryDate(rowData.deliveryDateid);
    setProductId(rowData.productid);
    setProductName(rowData.productName);
  

    setMobileNumber(rowData.mobileno);
    setEmailid(rowData.emailid);
    setAddress(rowData.address);
  
    setDeliveryDateId(rowData.deliveryDateid);
    setDeliveryTimeId(rowData.deliveryTimeid);
   
 

    setProductLogo({ url: `${serverURL}/images/${rowData.productLogo}`, bytes: "" });
 
    setTempFile({
   
      logo: `${serverURL}/images/${rowData.productLogo}`,
    });

    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    fetchAllDeliveryDate();
  };
  const showData = () => {
    return (
      <div>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heading title={"Product Details"} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                onFocus={() => handleError(false, "productName", "")}
                error={resError?.productName?.error}
                helperText={resError?.productName?.message}
                onChange={(event) => setProductName(event.target.value)}
                label="Product Name"
                fullWidth
                value={productName}
              />
            </Grid>
            
         

            <Grid item xs={4}>
              <TextField
                onFocus={() => handleError(false, "mobileNumber", "")}
                error={resError?.mobileNumber?.error}
                helperText={resError?.mobileNumber?.message}
                onChange={(event) => setMobileNumber(event.target.value)}
                label="Mobile Number"
                fullWidth
                value={mobileNumber}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                onFocus={() => handleError(false, "emailid", "")}
                error={resError?.emailid?.error}
                helperText={resError?.emailid?.message}
                value={emailid}
                onChange={(event) => setEmailid(event.target.value)}
                label="Email Address"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                onFocus={() => handleError(false, "address", "")}
                error={resError?.address?.error}
                helperText={resError?.address?.message}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                label="Address"
                fullWidth
              />
            </Grid>
      

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Delivery-Date</InputLabel>
                <Select
                  onFocus={() => handleError(false, "deliveryDateid", "")}
                  error={resError?.deliveryDateid?.error}
                  helperText={resError?.deliveryDateid?.message}
                  label="DeliveryDate"
                  value={deliveryDateid}
                  onChange={handleDeliveryDateChange}
                >
                  <MenuItem>-Select Delivery Date-</MenuItem>
                  {fillDeliveryDate()}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {resError?.deliveryDateid?.message}
                </FormHelperText>
              </FormControl>
              {
               
              }
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Delivery Time</InputLabel>
                <Select
                  label="DeliveryTime"
                  value={deliveryTimeid}
                  onChange={(event) => setDeliveryTimeId(event.target.value)}
                >
                  <MenuItem>-Select Delivery Time-</MenuItem>
                  {fillDeliveryTime()}
                </Select>
              </FormControl>
            </Grid>

        
    

            <Grid item xs={4}>
              <Button
                fullWidth
                component="label"
                variant="contained"
                endIcon={<UploadFile />}
              >
                <input
                  onChange={handleLogo}
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                />
                Upload Logo
              </Button>
            </Grid>
         
            <Grid item xs={4} className={classes.center}>
              <Avatar
                variant="rounded"
                alt="Remy Sharp"
                src={productLogo.url}
                sx={{ width: 56, height: 56 }}
              />

              <div>{btnStatus.logo ? editDeleteButton(3) : <></>}</div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  const showDataForEdit = () => {
    return (
      <Dialog maxWidth={"md"} open={open}>
        <DialogContent>{showData()}</DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Edit</Button>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  useEffect(function () {
    fetchAllProduct();
  }, []);

  const handleDelete = async (rowData) => {
    Swal.fire({
      title: "Do you want to delete the record?",
      showDenyButton: true,

      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (result) => {
  
      if (result.isConfirmed) {
        var body = { productid: rowData.productid };
        var result = await postData("product/product_delete", body);
        if (result.status) {
          Swal.fire("Deleted!", "", result.message);
          fetchAllProduct();
        } else Swal.fire("Fail!", "", result.message);
      } else if (result.isDenied) {
        Swal.fire("Employee not Delete", "", "info");
      }
    });
  };

  function displayAll() {
    return (
      <MaterialTable
        title="Employee List"
        columns={[
          {
            title: "Product",
            field: "ProductName",
            render: (rowData) => (
              <>
                <div>{rowData.productName}</div>
              </>
            ),
          },
          {
            title: "Address & Time",
            render: (rowData) => (
              <>
                <div>{rowData.address}</div>
                <div>
                  {rowData.deliverytime},{rowData.deliverydate}
                </div>
              </>
            ),
          },
          {
            title: "Contact",
            render: (rowData) => (
              <>
                {/* <div>{rowData.phonenumber}</div> */}
                <div>{rowData.mobileno}</div>
                <div>{rowData.emailid}</div>
              </>
            ),
          },
     
          {
            title: "Logo",
            render: (rowData) => (
              <div>
                <img
                  src={`${serverURL}/images/${rowData.productlogo}`}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                />
              </div>
            ),
          },
        ]}
        data={listProduct}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Product",
            onClick: (event, rowData) => handleEdit(rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete Product",
            onClick: (event, rowData) => handleDelete(rowData),
          },
          { icon:'add',
          isFreeAction:true,
            tooltip:'Add Company',
            onClick: (event) =>navigate('/dashboard/product')  },

        ]}
      />
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.box}>{displayAll()}</div>
      {showDataForEdit()}
    </div>
  );
}