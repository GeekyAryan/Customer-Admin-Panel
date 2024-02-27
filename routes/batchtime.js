var express = require('express');
var pool = require('./pool');
var router = express.Router();

/* GET home page. */
router.get('/fetch_all_dutiesIn', function(req, res, next) {
    try{
    pool.query("select * from dutyin",function(error,result){
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

router.post('/fetch_all_dutiesOut', function(req, res, next) {
    try{
    pool.query("select * from duty_out where dutyTimeInid=?",[req.body.dutyTimeInid],function(error,result){
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
