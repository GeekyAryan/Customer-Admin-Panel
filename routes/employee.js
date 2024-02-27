
var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
/* GET home page. */
router.post("/employee_submit", upload.any(), function (req, res, next) {
  pool.query("insert into employee(employeeName, emailid, mobileno, employeelogo, address,createdat, updatedat,password,dutyTimeInid,dutyTimeOutid)values(?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.employeeName,
      req.body.emailid,
      req.body.mobileno,
      req.files[0].filename,
      req.body.address,
      req.body.createdat,
      req.body.updatedat,
      req.body.password,
      req.body.dutyTimeInid,
      req.body.dutyTimeOutid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Employee Data Added Successfully" });
      }
    }
  );
});

router.get("/fetch_all_employee", function (req, res) {
  pool.query(
    "select R.*,(select D.dutytimein from dutyin D where D.dutyTimeInid=R.dutyTimeInid) as dutytimein, (select DO.dutytimeout from duty_out DO where DO.dutyTimeOutid=R.dutyTimeOutid) as dutytimein  from employee R",
    function (error, result) {
      if (error) {
        console.log(error);
        res
          .status(500)
          .json({ status: false, message: "Database Error", data: [] });
      } else {
        console.log(result);
        res
          .status(200)
          .json({
            status: true,
            data: result,
            message: "Employee Added Successfully",
          });
      }
    }
  );
});

router.post("/employee_edit_data", upload.any(), function (req, res, next) {
  pool.query(
    "update  employee set employeename=?, emailid=?, mobileno=?,  address=?,  updatedat=?,password=?, dutyTimeInid=?, dutyTimeOutid=? where employeeid=?",
    [
        req.body.employeename,
        req.body.emailid,
        req.body.mobileno,
        req.files[0].filename,
        req.body.address,
        req.body.dutyTimeInid,
        req.body.dutyTimeOutid,
        req.body.createdat,
        req.body.updatedat,
        req.body.password,
      req.body.employeeid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Employee Data Updated Successfully" });
      }
    }
  );
});

router.post("/employee_edit_logo", upload.any(), function (req, res, next) {
  pool.query(
    "update employee set employeelogo=? where employeeid=?",
    [req.files[0].filename, req.body.employeeid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({
            status: true,
            message: "Logo Certificate Updated Successfully",
          });
      }
    }
  );
});

router.post("/employee_delete", upload.any(), function (req, res, next) {
  pool.query(
    "delete from employee  where employeeid=?",
    [req.body.employeeid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Employee Deleted Successfully" });
      }
    }
  );
});

router.post('/chk_admin_login',function(req,res,next){
  pool.query("select * from employee where (emailid=? or mobileno=?) and password=? ",[req.body.emailid,req.body.mobileno,req.body.password],function(error,result){
  
    if(error)
    {
      console.log(error);
       res.status(500).json({status:false,message:'Server Error'})
    }
     
    else{
  
      if(result.length==0)
      { 
        res.status(200).json({status:false,message:'Invalid email address/mobile number/password'})
      }
  
       else
       {res.status(200).json({status:true,message:'Valid Login',data:result[0]})}
    }
  })
  
  
  
  })

module.exports = router;
