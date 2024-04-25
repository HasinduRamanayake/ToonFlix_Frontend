var AppRouter = Backbone.Router.extend({
    routes: {
        "": "login",
        "dashboard": "dashboard",
        "create_post": "createPost",
        "home": "home",
        "posts/:id": "showDetailedPost",
        "*path": "notFoundPage"
    },

   
    login: function() {
        console.log("Login route is called.");
        new AuthView({el:'#app'}); 
       
    },
    dashboard: function() {
        new DashboardView({el:'#app'});
    },

    createPost: function(){
        new PostFormView({el:'#app'});       
    },

    home: function(){
        // new PostsCollectionView({el:'#app'});
    },
    
    notFoundPage: function(){
        new NotFoundView({el:'#app'});
    },

    showDetailedPost: function(id) {
        new PostDetailView({id: id, el:'#app', currentUser:'100'});
    }

    
    


    
    
});
