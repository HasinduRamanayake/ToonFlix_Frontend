// Login Model
var LoginModel = Backbone.Model.extend({
    urlRoot: '/toonflix/api/auth/signin', 
    defaults: {
        username: '',
        password: ''
    }
});

var SignUpModel = Backbone.Model.extend({
    urlRoot: '/toonflix/api/auth/signup', 
    defaults: {
        username: '',
        password: '',
        email: '' 
    }
});