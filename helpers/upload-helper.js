const path = require('path')

module.exports = {
    uploadDir : path.join(__dirname, "../public/uploads/"),

    isEmpty: function(files) {
        // Check if files is not present or is an empty object
        return !files || Object.keys(files).length === 0;
    }
};
