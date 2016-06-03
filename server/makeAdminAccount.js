
var readline = require('readline');
var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');
var self = this;

var UserSchema = {
    username: String,
    password: String
};
var connection = mongoose.connect('mongodb://localhost/DealGiraffe');
var User = connection.model('User', UserSchema);

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log('Enter below information to create a new admin account');
process.stdout.write("username: ");

var userFields = {};
rl.on('line', function(line){
    if (!userFields.username) {
        userFields.username = line;
        process.stdout.write("password: ");
    } else if (!userFields.password){
        userFields.password = line;
        process.stdout.write("password again: ");
    } else {
        userFields.passwordAgain = line;
        self.registerUser(userFields);
    }
});

self.registerUser = function(userFields) {
    if (userFields.password !== userFields.passwordAgain) {
        console.log('Passwords did not match. Exiting');
        return process.exit(1);
    }

    var salt = bCrypt.genSaltSync(10);
    var hash = bCrypt.hashSync(userFields.password, salt);
    var newParams = {
        username: userFields.username,
        password: hash
    };

    var user = new User(newParams);
    user.save(function(err, result){
        if (err) {
            console.log('Error: ' + err);
        }
        console.log('User ' + userFields.username + " created successfully");
        process.exit(0);
    });
};
