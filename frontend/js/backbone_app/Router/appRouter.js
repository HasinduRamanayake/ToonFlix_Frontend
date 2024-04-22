var AppRouter = Backbone.Router.extend({
    routes: {
        "": "login",
        "dashboard": "dashboard",
        "create_post": "createPost",
        "home": "home"
    },

   
    login: function() {
        console.log("Login route is called.");
        new AuthView({el:'#app'}); // Call render on the view to update the UI
       
    },
    dashboard: function() {
        new DashboardView({el:'#app'});
    },

    createPost: function(){
       
        // if (!this.postFormView) {
        //     this.postFormView = new PostFormView({ model: new Post() });
        // }
        new PostFormView({el:'#app'});       
    },

    home: function(){
        new PostsCollectionView({el:'#app'});
    },
    

    
    
});
