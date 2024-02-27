
var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
/* GET home page. */
router.post("/product_submit", upload.single("productlogo"), function (req, res, next) {
  pool.query("insert into product(productName, emailid, mobileno, productlogo, address,createdat, updatedat,password,deliveryDateid,deliveryTimeid)values(?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.productName,
      req.body.emailid,
      req.body.mobileno,
      req.file.filename,
      req.body.address,
      req.body.createdat,
      req.body.updatedat,
      req.body.password,
      req.body.deliveryDateid,
      req.body.deliveryTimeid,
      
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

router.get("/fetch_all_product", function (req, res) {
  pool.query(
    "select R.*,(select P.deliverydate from date P where P.deliveryDateid=R.deliveryDateid) as deliverydate, (select T.deliverytime from time T where T.deliveryTimeid=R.deliveryTimeid) as deliverydate  from product R",
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
            message: "Product Added Successfully",
          });
      }
    }
  );
});




router.post("/product_edit_data", upload.any(), function (req, res, next) {
  pool.query(
    "update  product set productname=?, emailid=?, mobileno=?,  address=?,  updatedat=?,password=?, deliveryDateid=?, deliveryTimeid=? where productid=?",
    [
        req.body.employeename,
        req.body.emailid,
        req.body.mobileno,
        req.files[0].filename,
        req.body.address,
        req.body.deliveryDateid,
        req.body.deliveryTimeid,
        req.body.createdat,
        req.body.updatedat,
        req.body.password,
      req.body.productid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Database Error" });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Product Data Updated Successfully" });
      }
    }
  );
});

router.post("/product_edit_logo", upload.any(), function (req, res, next) {
  pool.query(
    "update product set productlogo=? where productid=?",
    [req.files[0].filename, req.body.productid],
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

router.post("/product_delete", upload.any(), function (req, res, next) {
  pool.query(
    "delete from product  where productid=?",
    [req.body.productid],
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
  pool.query("select * from product where (emailid=? or mobileno=?) and password=? ",[req.body.emailid,req.body.mobileno,req.body.password],function(error,result){
  
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
