var AppRouter = Backbone.Router.extend({
    routes: {
        "": "login",
        "dashboard": "dashboard",
        "create_post": "createPost",
        "home": "dashboard",
        "posts/:id": "showDetailedPost",
        "blog_posts": "blogPostsPage",
        "my_library": "library",
        'signout': 'signOut',
        "*path": "notFoundPage"
    },

    initialize: function() {
        this.rootEl = $('#app');  
        // Listener to change the visibility of navbar links
        this.listenTo(this, 'route', this.handleRouteChange);
    },
    handleRouteChange: function(routeName) {        
        var routesWithoutAccessButtons = ['createPost', 'login', 'showDetailedPost'];
        var routesWithoutNavBar = ['login']
        this.toggleNavBarLinks(!routesWithoutAccessButtons.includes(routeName), !routesWithoutNavBar.includes(routeName));
    },

    toggleNavBarLinks: function(showAccessButton, showNavbarLinks) {
        $('#access_buttons').css('display', showAccessButton ? 'inline-block' : 'none');
        $('#links').css('display', showNavbarLinks ? 'flex' : 'none');
    },

    clearEvents: function() {
        // Elimanating all event handlers attached to the root element
        this.rootEl.off(); 
    },
   
    login: function() {
        new AuthView({el:'#app'}); 
        
    },
    dashboard: function() {
        AuthService.validateSession().then(() => {
            new DashboardView({el:'#app'});
            this.updateNavigation('dashboard');
        }).catch(error => console.error(error));
    },

    createPost: function(){
        AuthService.validateSession();
        new PostFormView({el:'#app'});   
            
    },

    library: function(){
        AuthService.validateSession();
        new MyLibraryView({el:'#app'});
        this.updateNavigation('my_library');
    },
    
    notFoundPage: function(){
        new NotFoundView({el:'#app'});
    },
   

    blogPostsPage: function(){
        AuthService.validateSession();
        new BlogPostView({el:'#app'});
        this.updateNavigation('blog_posts');
    },    

    showDetailedPost: function(id) {
        AuthService.validateSession();
        this.clearEvents(); 
        new PostDetailView({id: id, el:'#app'});       
       
    },

    signOut: function() {
        AuthService.signOut();
        this.clearEvents(); 
    },
    

    updateNavigation: function(activeRoute) {
        
        $('.navbar li a').removeClass('home-active');
        
        $(`.navbar li a[href='#${activeRoute}']`).addClass('home-active');
    }
   
});
