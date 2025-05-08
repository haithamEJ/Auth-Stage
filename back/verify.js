const speakeasy = require('speakeasy')
var verified = speakeasy.totp.verify({
    secret: '*up@im(*(>t(TWETOG/2rcQ{6&iT1ysZ',
    encoding: 'ascii',
    token: '000000'
})

