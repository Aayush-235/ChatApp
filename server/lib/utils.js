import jwt from 'jsonwebtoken'

//Function to generate a token for a user

export const generateToken = (userId) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET)
    // console.log(token)

    return token;

}

// format of JsonWebToken => jwt.sign(data, secrect_key)
// here we pass data in the form of object because in JWT, we can pass a payload object reason is that after in backend we can varify it and know which user is logged in