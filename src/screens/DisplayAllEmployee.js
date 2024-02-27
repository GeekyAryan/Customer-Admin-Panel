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

// import Heading from "../../components/Heading/Heading";
import Heading from "../components/Heading/Heading";

// const useStyles = makeStyles({
  // rootdisplay: {
  //   width: "auto",
  //   height: "100vh",
  //   background: "#dfe4ea",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // boxdisplay: {
  //   width: "80%",
  //   height: "auto",
  //   borderRadius: 10,
  //   background: "#fff",
  //   padding: 15,
  // },
//   root: {
//     width: "100vw",
//     height: "100vh",
//     background: "#dfe4ea",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   box: {
//     width: "60%",
//     height: "auto",
//     borderRadius: 10,
//     background: "#fff",
//     padding: 15,
//   },
//   center: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

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
export default function DisplayAllEmployee() {
    
  const admin = JSON.parse(localStorage.getItem('ADMIN'))
  console.log(admin);

  var classes = useStyles();
  var navigate=useNavigate()
  
  const [listEmployee, setListEmployee] = useState([]);
  const [open, setOpen] = useState(false);
  ////////////  Data /////////////////////
  const [employeeId, setEmployeeId] = useState(admin.employeeid)



  const [dutyTimeIn, setDutyTimeIn] = useState([]);
  const [dutyTimeOut, setDutyTimeOut] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

 
  
  const [dutyTimeInid, setDutyTimeInId] = useState("");
  const [dutyTimeOutid, setDutyTimeOutId] = useState("");


  const [employeeName, setEmployeeName] = useState("");

  const [emailid, setEmailid] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address,setAddress]=useState("")

 

  const [employeeLogo, setEmployeeLogo] = useState({ url: "", bytes: "" });

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



 
  const validation=()=>
  {  var submitRecord=true
     if(employeeName.trim().length==0)
     {
      handleError(true,'employeeName',"Pls Input Employee Name")
       
      submitRecord=false
     }
   
     if(!mobileNumber || !(/^[0-9]{10}$/).test(mobileNumber))
     {
      handleError(true,'mobileNumber',"Pls Input Correct Mobile Number")
       
      submitRecord=false
     }
     if(!emailid || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailid))) 
    {
      handleError(true,'emailid',"Pls Input Correct Email Address")
       
      submitRecord=false
    }

    if(!address)
    {
     handleError(true,'address',"Pls Input Address")
      
     submitRecord=false
    }
   
   
    if(!dutyTimeInid)
    {
     handleError(true,'dutyTimeInid',"Pls Select Batch Time")
      
     submitRecord=false
    }

    if (!password) {
     handleError("password", "Pls Input Password");
     submitRecord = false;
   }
  
    return submitRecord
  } 



  const fetchAllDutyTimeIn=async()=>{

    var result=await getData('batchtime/fetch_all_dutiesIn')

    setDutyTimeIn(result.data)


  }

  useEffect (function()

  {

       fetchAllDutyTimeIn()
 },[])

 const fillDutyTimeIn=()=>{
  return dutyTimeIn.map((item)=>{
    return<MenuItem value={item.dutyTimeInid}>{item.dutytimein}</MenuItem>
  })
}



  const fetchAllDutyTimeOut=async(dutyTimeInid)=>{
    var body={dutyTimeInid:dutyTimeInid}
    var result=await postData('batchtime/fetch_all_dutiesOut',body)
    setDutyTimeOut(result.data)

  }

  const fillDutyTimeOut=()=>{
    return dutyTimeOut.map((item)=>{
      return<MenuItem value={item.dutyTimeOutid}>{item.dutytimeout}</MenuItem>
    })
  }

 

  const handleDutyTimeInChange=(event)=>{
    setDutyTimeInId(event.target.value)
    fetchAllDutyTimeOut(event.target.value)
  }



  const handleLogo = (event) => {
    setEmployeeLogo({
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
        employeename: employeeName,
       
    
        emailid: emailid,
        mobileno: mobileNumber,
        address: address,
       
        dutyTimeInid: dutyTimeInid,
        dutyTimeOutid: dutyTimeOutid,
    
        employeeid: employeeId,
      };

      var result = await postData("employee/employee_edit_data", body);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Employee Registration",
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
      setEmployeeLogo({ url: tempFile.logo, bytes: "" });
    }
  };
  const editImage = async (imgStatus) => {
    if (imgStatus == 1) {
      var formData = new FormData();
      formData.append("employeeid",employeeId);
      formData.append("employeeLogo",  employeeLogo.bytes);
      var result = await postData("employee/employee_edit_logo", formData);
      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Employee Registration",
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

  const fetchAllEmployee = async () => {
    var result = await getData("employee/fetch_all_employee");
    setListEmployee(result.data);
  };

  const handleEdit = (rowData) => {
   
    fetchAllDutyTimeOut(rowData.dutyTimeInid);
    setEmployeeId(rowData.employeeid);
    setEmployeeName(rowData.employeeName);
  

    setMobileNumber(rowData.mobileno);
    setEmailid(rowData.emailid);
    setAddress(rowData.address);
  
    setDutyTimeInId(rowData.dutyTimeInid);
    setDutyTimeOutId(rowData.dutyTimeOutid);
   
    setEmployeeLogo({ url: `${serverURL}/images/${rowData.employeeLogo}`, bytes: "" });
 
    setTempFile({
   
      logo: `${serverURL}/images/${rowData.employeeLogo}`,
    });

    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    fetchAllDutyTimeIn();
  };
  const showData = () => {
    return (
      <div>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heading title={"Employee Register"} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                onFocus={() => handleError(false, "employeeName", "")}
                error={resError?.employeeName?.error}
                helperText={resError?.employeeName?.message}
                onChange={(event) => setEmployeeName(event.target.value)}
                label="Employee Name"
                fullWidth
                value={employeeName}
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
                <InputLabel>DutyTime-In</InputLabel>
                <Select
                  onFocus={() => handleError(false, "dutyTimeInid", "")}
                  error={resError?.dutyTimeInid?.error}
                  helperText={resError?.dutyTimeInid?.message}
                  label="DutyTimeIn"
                  value={dutyTimeInid}
                  onChange={handleDutyTimeInChange}
                >
                  <MenuItem>-Select Duty Time-</MenuItem>
                  {fillDutyTimeIn()}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {resError?.dutyTimeInid?.message}
                </FormHelperText>
              </FormControl>
              {
                //resError?.stateid?.error?<div>{resError?.stateid?.message}</div>:<></>
              }
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Duty Time Out</InputLabel>
                <Select
                  label="DutyTimeOut"
                  value={dutyTimeOutid}
                  onChange={(event) => setDutyTimeOutId(event.target.value)}
                >
                  <MenuItem>-Select Duty Time Out-</MenuItem>
                  {fillDutyTimeOut()}
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
                src={employeeLogo.url}
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
    fetchAllEmployee();
  }, []);

  const handleDelete = async (rowData) => {
    Swal.fire({
      title: "Do you want to delete the record?",
      showDenyButton: true,

      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var body = { employeeid: rowData.employeeid };
        var result = await postData("employee/employee_delete", body);
        if (result.status) {
          Swal.fire("Deleted!", "", result.message);
          fetchAllEmployee();
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
            title: "Employee",
            field: "employeeName",
            render: (rowData) => (
              <>
                <div>{rowData.employeeName}</div>
              </>
            ),
          },
          {
            title: "Address & time",
            render: (rowData) => (
              <>
                <div>{rowData.address}</div>
                <div>
                  {rowData.dutytimeout},{rowData.dutytimein}
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
                  src={`${serverURL}/images/${rowData.employeelogo}`}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                />
              </div>
            ),
          },
        ]}
        data={listEmployee}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Employee",
            onClick: (event, rowData) => handleEdit(rowData),
          },
          {
            icon: "delete",
            tooltip: "Delete Employee",
            onClick: (event, rowData) => handleDelete(rowData),
          },
          { icon:'add',
          isFreeAction:true,
            tooltip:'Add Company',
            onClick: (event) =>navigate('/dashboard/employee')  },

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