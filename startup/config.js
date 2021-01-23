

module.exports.getKeyPass =function(){
if(! process.env.TOKEN_KEY_PASS){

  //throw new Error('FATAL ERORR: jwtprivatekey is not defined ');
  return "vidly_jwtPrivateKey";

}else{
    return process.env.TOKEN_KEY_PASS;
}
}