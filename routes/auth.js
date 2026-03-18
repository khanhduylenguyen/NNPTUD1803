let express = require('express');
let router = express.Router()
let userController = require('../controllers/users')
let bcrypt = require('bcrypt');
const { CheckLogin } = require('../utils/authHandler');
let jwt = require('jsonwebtoken')
let fs = require('fs')
let privateKey = fs.readFileSync('private.pem', 'utf8');
const { validateChangePassword } = require('../utils/validator');
router.post('/register', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let newUser = await userController.CreateAnUser(username, password, email,
            "69b1265c33c5468d1c85aad8"
        )
        res.send(newUser)
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})

router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);
        if (!user) {
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
            return;
        }
        if (user.lockTime > Date.now()) {
            res.status(404).send({
                message: "ban dang bi ban"
            })
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save()
            let token = jwt.sign({
                id: user._id
            }, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1d'
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount == 3) {
                user.loginCount = 0;
                user.lockTime = Date.now() + 3600 * 1000;
            }
            await user.save()
            res.status(404).send({
                message: "thong tin dang nhap khong dung"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
})
router.get('/me', CheckLogin, function (req, res, next) {
    res.send(req.user)
})

router.post('/changepassword', CheckLogin, validateChangePassword, async function (req, res, next) {
    try {
        let { oldPassword, newPassword } = req.body;
        let user = req.user;

        // Verify old password
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            res.status(400).send({
                message: "Mat khau cu khong dung"
            });
            return;
        }

        // Update password (pre hook in schema will hash it)
        user.password = newPassword;
        await user.save();

        res.send({
            message: "Doi mat khau thanh cong"
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});
module.exports = router