

module.exports=function(){
if(! process.env.TOKEN_KEY_PASS){
throw new Error('FATAL ERORR: jwtprivatekey is not defined ');
}
}