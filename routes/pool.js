var mysql=require("mysql")
var pool=mysql.createPool(
    { host:'localhost',
    port:3306,
    user:'root',
    password:'root123',
    database:'patient',
    multipleStatements:'true'

})
module.exports=pool