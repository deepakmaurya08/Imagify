import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid token. Login Again' });
    }

    req.user = { id: decoded.id }; // ✅ safer than modifying req.body
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default userAuth;





// import jwt from 'jsonwebtoken'

// const userAuth = async (req, res, next) =>{
//     const {token} = req.headers;

//     if(!token){
//         return res.json({ success: false, message: 'Not Authorized. Login Again '});
//     }

//     try{
//          const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//          if(tokenDecode.id){
//             req.body.userid = tokenDecode.id;
//          }else{
//             return res.json({ success: false, message: 'Not Authorized. Login Again'});
//          }

//          next();

//     }catch(error){
//         res.json({ success: false, message: error.message});
//     }
// };


// export default userAuth;