const jwt=require('jsonwebtoken');
//const config=require('config');

module.exports=(req,res,next) =>{

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY_PASS);
        console.log(decodedToken);
        req.user = { email: decodedToken.email,_id: decodedToken.id };
        next();
      } catch (error) {
        res.status(401).json({ message: "You are not authenticated!" });
      }



}

