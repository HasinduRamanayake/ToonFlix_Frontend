var AppRouter = Backbone.Router.extend({
    routes: {
        "": "login",
        "dashboard": "dashboard",
        "create_post": "createPost",
        "home": "home",
        "posts/:id": "showDetailedPost",
        "blog_posts": "blogPostsPage",
        "my_library": "library",
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

    library: function(){
        new MyLibraryView({el:'#app'});
    },
    
    notFoundPage: function(){
        new NotFoundView({el:'#app'});
    },

    showDetailedPost: function(id) {
        new PostDetailView({id: id, el:'#app', currentUser:'100'});
    },

    blogPostsPage: function(){

        new BlogPostView({el:'#app'});
    }
   
});
