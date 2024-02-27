import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";

import { useState, useEffect } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { makeStyles } from "@mui/styles";
import Heading from "../components/Heading/Heading";
import UploadFile from "@mui/icons-material/UploadFile";
import Swal from "sweetalert2";
import { serverURL, getData, postData } from "../services/ServerServices";
import { useNavigate } from "react-router-dom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const useStyles = makeStyles({
  root: {
    width: "auto",
    height: "100vh",
    background: "#dfe4ea",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    width: "70%",
    height: "auto",
    borderRadius: 10,
    background: "#fff",
    padding: 15,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function Delivery() {
  var navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("ADMIN"));
  console.log(admin);
  var classes = useStyles();

 

  const [productId, setProductId] = useState(admin.productid);

  const [showPassword, setShowPassword] = useState(false);

  
  const [productName, setProductName] = useState("");
  const [emailid, setEmailid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [productLogo, setProductLogo] = useState({ url: "", bytes: "" });
  const [password, setPassword] = useState("");



  const [deliveryDate, setDeliveryDate] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState([]);

  const [deliveryDateid, setDeliveryDateId] = useState("");
  const [deliveryTimeid, setDeliveryTimeId] = useState("");


  const [resError, setResError] = useState({});

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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const clearValue = () => {
    setProductName("");
    setEmailid("");
    setMobileNumber("");
    setAddress("");
    setDeliveryDateId("Choose Delivery Date...");
    setDeliveryTimeId("Choose Delivery Time...");
    
    setProductLogo({ fileName: "/assets/watermark.png", bytes: "" });
    setPassword("");
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
      return (
        <MenuItem value={item.deliveryDateid}>{item.deliverydate}</MenuItem>
      );
    });
  };

  const fetchAllDeliveryTime = async (deliveryTimeid) => {
    var body = { deliveryTimeid: deliveryTimeid };
    var result = await postData("datetime/fetch_all_time", body);
    setDeliveryTime(result.data);
    // alert(JSON.stringify(result.data))
    // alert(deliveryTimeid)
  };

  const fillDeliveryTime = () => {
    return deliveryTime.map((item) => {
      return (
        <MenuItem value={item.deliveryTimeid}>{item.deliverytime}</MenuItem>
      );
    });
  };

  const handleDeliveryDateChange = (event) => {
    alert(event.target.value);
    setDeliveryDateId(event.target.value);
    fetchAllDeliveryTime(event.target.value);
  };



  const handleLogo = (event) => {
    setProductLogo({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const handleSubmit = async () => {
    alert("hggffg");
    // var error = validation();
    // console.log("After Submit:", resError);
    // if (error) {
    var formData = new FormData();
    formData.append("productid", productId);
    formData.append("productName", productName);
    formData.append("emailid", emailid);
    formData.append("mobileno", mobileNumber);
    formData.append("address", address);

    //    formData.append('url',url)
    formData.append("password", password);
    formData.append("deliveryDateid", deliveryDateid);
    formData.append("deliveryTimeid", deliveryTimeid);
    formData.append("productlogo", productLogo.bytes);

    // formData.append("stateid", stateid);
    // formData.append("cityid", cityid);

    var d = new Date();
    var cd = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    formData.append("createdat", cd);
    formData.append("updatedat", cd);
    var result = await postData("product/product_submit", formData);

    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Product Details",
        text: result.message,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.message,
      });
      clearValue();
      //   }
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.rowStyle}>
            {/* <div style={{ display: "flex", flexDirection: "row" }}>
              <div>
                <img src="biglogo.png" width="40" />
              </div>
              <div className={classes.headingStyle}> Patient Registration</div>
            </div> */}

            <Heading title={"Customer Page"} />

            <div>
              <FormatListBulletedIcon
                onClick={() => navigate("/displayallproduct")}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <TextField
              onFocus={() => handleError(false, "productName", "")}
              error={resError?.productName?.error}
              helperText={resError?.productName?.message}
              onChange={(event) => setProductName(event.target.value)}
              label="Product Name"
              fullWidth
            ></TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              onFocus={() => handleError(false, "mobileno", "")}
              error={resError?.mobilenumber?.error}
              helperText={resError?.mobilenumber?.message}
              onChange={(event) => setMobileNumber(event.target.value)}
              label="Mobile Number"
              fullWidth
            ></TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              onFocus={() => handleError(false, "emailid", "")}
              error={resError?.emailid?.error}
              helperText={resError?.emailid?.message}
              onChange={(event) => setEmailid(event.target.value)}
              label="Email Address"
              fullWidth
            ></TextField>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => handleError("password", null)}
                error={!resError.password ? false : true}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              onFocus={() => handleError(false, "address", "")}
              error={resError?.address?.error}
              helperText={resError?.address?.message}
              onChange={(event) => setAddress(event.target.value)}
              label="Address"
              fullWidth
            ></TextField>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Delivery Date</InputLabel>
              <Select
                onFocus={() => handleError(false, "deliveryDateid", "")}
                error={resError?.deliveryDateid?.error}
                helperText={resError?.deliveryDateid?.message}
                label="Product"
                value={deliveryDateid}
                onChange={handleDeliveryDateChange}
              >
                <MenuItem>-Select Delivery Date-</MenuItem>
                {fillDeliveryDate()}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
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

          <Grid item xs={6}>
            <Button
              fullWidth
              component="label"
              variant="contained"
              endIcon={<UploadFile />}
            >
              <input
                hidden
                onChange={handleLogo}
                accept="image/*"
                multiple
                type="file"
              />
              Upload Logo
            </Button>
          </Grid>

          <Grid item xs={6} className={classes.center}>
            <Avatar
              variant="rounded"
              alt="Remy Sharp"
              src={productLogo.url}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button onClick={handleSubmit} variant="contained" fullWidth>
              Submit
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button onClick={clearValue} variant="contained" fullWidth>
              Reset
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
