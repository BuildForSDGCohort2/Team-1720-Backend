const jwt = require('jsonwebtoken');
const User = require('../models/users/User');

const auth = async(req, res, next) => {
    // const token = req.header('Authorization').replace('Bearer Token', '');
    // const data = jwt.verify(token, process.env.JWT_KEY);


    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('to\'ken not found')
    }

    // Test the token to see if it is valid.
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {

        if (err) {
            console.log(err.JsonWebTokenError);
            return res.status(401).send({ error: 'Not authorized to access this resource - to\'ken invalid' });
        }


        try {
            const user = await User.findOne({
                _id: decoded._id,
                'tokens.token': token
            })
            if (!user) {
                console.log('Error 01');
                throw new Error()
            }
            req.user = user
            req.token = token
            next()
        } catch (error) {
            console.log('Error 02');
            res.status(401).send({
                error: 'Not authorized to access this resource'
            })
        }


    });

}
module.exports = auth