var AuthView = Backbone.View.extend({
    
    initialize: function() {
        var self = this;
        // Fetch the login.html content
        $.get('html/login.html', function(data) {
            self.template = data;
            self.render();
        });
    },
    
    render: function() {
        // Use the fetched HTML as the view's template
        this.$el.html(this.template);
        this.delegateEvents({
            'submit #login-form': 'login',
            'submit #signup-form': 'signUp'
        });
        return this;
    },

    login: function(e) {
        
        e.preventDefault();
        var userData = {
            username: this.$('#username').val(),
            password: this.$('#password').val(),
        };
        console.log(userData);
        $.ajax({
            url: 'http://localhost/toonflix/api/auth/signin',
            type: 'POST',
            data: userData,
            success: function(response) {
                console.log('Login Successful', response);
                console.log('UserData',userData);
                Backbone.history.navigate('dashboard', { trigger: true });
            },
            error: function(error) {
                console.log('Login Failed', error);
            }
        });
    },

    signUp: function(e) {
        e.preventDefault();

        var userData = {
            username: this.$('#new-username').val(),
            password: this.$('#new-password').val(),
            email: this.$('#email').val(),
        };
        console.log("usetData",userData);
        $.ajax({
            url: 'http://localhost/toonflix/api/auth/signup',
            type: 'POST',
            data: userData,
            success: function(response) {
                console.log('Sign Up Successful', response);
                // Optionally log in the user directly or show a success message
                alert("Registration successful. Please log in.");
                $('#signup-form').hide();
                $('#login-form').show();
                $('#toggle-form').text("Don't have an account? Sign Up");
            },
            error: function(error) {
                console.log('Sign Up Failed', error);
            }
        });
    }
});




