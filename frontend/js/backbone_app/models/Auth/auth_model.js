var AuthModel = Backbone.Model.extend({
    defaults: {
        username: '',
        password: '',
        email: '' 
    }
});

var LoginModel = AuthModel.extend({
    urlRoot: 'http://localhost/toonflix/api/auth/signin'
});

var SignUpModel = AuthModel.extend({
    urlRoot: 'http://localhost/toonflix/api/auth/signup'
});
