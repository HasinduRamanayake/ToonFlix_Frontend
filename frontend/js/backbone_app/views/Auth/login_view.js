var AuthView = Backbone.View.extend({
    
    initialize: function() {
        this.loadTemplate();
    },

    events: {
        'submit #login-form': 'login',
        'submit #signup-form': 'signUp',
        'click #toggle-form': 'toggleForms'
    },

    loadTemplate: function() {
        var self = this;
        $.get('html/login.html', function(data) {
            self.template = data;
            self.render();
        });
    },

    render: function() {
        this.$el.html(this.template);
        this.toggleForms();  // Initially setup forms display
        return this;
    },

    login: function(e) {
        e.preventDefault();
        var loginModel = new LoginModel({
            username: this.$('#username').val(),
            password: this.$('#password').val()
        });
        loginModel.save(null, {
            success: function(model, response) {
                console.log('Login Successful', response);
                Backbone.history.navigate('dashboard', { trigger: true });
            },
            error: function(model, error) {
                console.log('Login Failed', error);
            }
        });
    },

    signUp: function(e) {
        e.preventDefault();
        var signUpModel = new SignUpModel({
            username: this.$('#new-username').val(),
            password: this.$('#new-password').val(),
            email: this.$('#email').val()
        });
        var self = this; // Save the current context
        signUpModel.save(null, {
            success: function(model, response) {
                alert("Registration successful. Please log in.");
                self.toggleForms(); // Use self which is bound to the correct context
            },
            error: function(model, error) {
                console.log('Sign Up Failed', error);
            }
        });
    },

    toggleForms: function() {
        var loginVisible = this.$('#login-form').is(':visible');
        this.$('#login-form').toggle(!loginVisible);
        this.$('#signup-form').toggle(loginVisible);
        this.$('#toggle-form').text(loginVisible ? "Already have an account? Log In" : "Don't have an account? Sign Up");
    }
});
