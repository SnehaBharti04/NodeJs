const path = require('path')

module.exports = {
    entry : path.resolve(__dirname, 'src'),
    output : {
        path : path.resolve(__dirname,'builds'),
        filename : 'bundle.js'
    }
}