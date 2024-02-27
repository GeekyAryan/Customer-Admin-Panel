var express = require('express');
var pool = require('./pool');
var router = express.Router();

/* GET home page. */
router.get('/fetch_all_date', function(req, res, next) {
    try{
    pool.query("select * from date",function(error,result){
        if(error)
        {
            res.status(500).json({status:false,message:'Database Error...',data:[]})
        }
        else{
            res.status(200).json({status:true,message:'Success...',data:result})
        }})
    }
    catch(e)
    {
        res.status(200).json({status:false,message:'Server Error...',data:[]})
    }
 
});

router.post('/fetch_all_time', function(req, res, next) {
    console.log(req.body)
    try{
    pool.query("select * from time where deliveryDateid=?",[req.body.deliveryTimeid],function(error,result){
        if(error)
        {
            res.status(500).json({status:false,message:'Database Error...',data:[]})
        }
        else{
            res.status(200).json({status:true,message:'Success...',data:result})
        }})
    }
    catch(e)
    {
        res.status(200).json({status:false,message:'Server Error...',data:[]})
    }
 
});

module.exports = router;
