import jwt from 'jsonwebtoken'

const authMiddleware  = async (req,res,next) =>{
    const {token} = req.headers;
    if(!token){
        return res.json({success:false, message:"Not authorized please login"})
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error while verifying authentication"})
    }


}

export default authMiddleware