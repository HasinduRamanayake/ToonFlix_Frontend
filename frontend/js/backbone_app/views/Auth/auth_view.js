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
        this.toggleForms(); //initial form toggling
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
                localStorage.setItem('user', JSON.stringify(model.toJSON()));
                Backbone.history.navigate('dashboard', { trigger: true });
            },
            error: function() {
            
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthorized',
                    text: 'Please Sign Up If you havent created an account yet',
                    
                });         
                
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
        var self = this; 
        signUpModel.save(null, {
            success: function(model, response) {
            
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'Please Login!',                    
                }); 
                self.toggleForms(); 
            },
            error: function(model, error) {
            
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Unsuccessful',
                    text: 'Please Try Again!'+ response,                    
                }); 
            }
        });
    },
    

    toggleForms: function() {
        var loginVisible = this.$('#login-form').is(':visible');
        this.$('#login-form').toggle(!loginVisible);
        this.$('#signup-form').toggle(loginVisible);
        this.$('#toggle-form').text(loginVisible ? "Have an account? Log In" : "Don't have an account? Sign Up");
    }
});
