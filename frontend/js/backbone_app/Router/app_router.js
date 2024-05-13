var AppRouter = Backbone.Router.extend({
    routes: {
        "": "login",
        "dashboard": "dashboard",
        "create_post": "createPost",
        "home": "dashboard",
        "posts/:id": "showDetailedPost",
        "blog_posts": "blogPostsPage",
        "my_library": "library",
        "*path": "notFoundPage"
    },

    initialize: function() {
        this.rootEl = $('#app');  
        // Listener to change the visibility of navbar links
        this.listenTo(this, 'route', this.handleRouteChange);
    },
    handleRouteChange: function(routeName) {        
        var routesWithoutCreatePostButton = ['createPost', 'login', 'showDetailedPost'];
        var routesWithoutNavBar = ['login']
        this.toggleCreatePostButton(!routesWithoutCreatePostButton.includes(routeName), !routesWithoutNavBar.includes(routeName));
    },

    toggleCreatePostButton: function(showCreatePostButton, showNavbarLinks) {
        $('#createPostButton').css('display', showCreatePostButton ? 'inline-block' : 'none');
        $('#links').css('display', showNavbarLinks ? 'flex' : 'none');
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
        new DashboardView({el:'#app'});
        this.updateNavigation('dashboard');
    },

    createPost: function(){
        new PostFormView({el:'#app'});   
            
    },

    library: function(){
        new MyLibraryView({el:'#app'});
        this.updateNavigation('my_library');
    },
    
    notFoundPage: function(){
        new NotFoundView({el:'#app'});
    },
   

    blogPostsPage: function(){

        new BlogPostView({el:'#app'});
        this.updateNavigation('blog_posts');
    },    

    showDetailedPost: function(id) {
        this.clearEvents(); 
        new PostDetailView({id: id, el:'#app'});       
       
    },

    updateNavigation: function(activeRoute) {
        
        $('.navbar li a').removeClass('home-active');
        
        $(`.navbar li a[href='#${activeRoute}']`).addClass('home-active');
    }
   
});
