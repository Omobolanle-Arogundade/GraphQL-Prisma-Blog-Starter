import jwt from 'jsonwebtoken'

const generateToken = (id) => {

    return jwt.sign({ userId: id }, "myjwtsecret", {
        expiresIn: '1hr'
    })
    
}

export default generateToken;