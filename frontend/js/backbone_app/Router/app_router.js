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

    initialize: function() {
        this.rootEl = $('#app');  
    },

    clearEvents: function() {
        // Elimanating all event handlers attached to the root element
        this.rootEl.off(); 
    },
   
    login: function() {
        console.log("Login route is called.");
        new AuthView({el:'#app'}); 
       
    },
    dashboard: function() {
        if (this.currentDetailView) {
            this.currentDetailView.undelegateEvents();
            if (this.currentDetailView.removeView) {
                this.currentDetailView.removeView(); // Custom cleanup method if defined
            } else {
                this.currentDetailView.remove(); // Removes view from DOM and unbinds events
            }
        }
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

    

    blogPostsPage: function(){

        new BlogPostView({el:'#app'});
    },    

    showDetailedPost: function(id) {
        this.clearEvents(); 

        new PostDetailView({id: id, el:'#app', currentUser:'1'});        
    },
   
});
