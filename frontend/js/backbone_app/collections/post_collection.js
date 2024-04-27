var PostsCollection = Backbone.Collection.extend({
    url: 'http://localhost/toonflix/api/posts/get_all_posts', 
    model: PostModel,

    initialize: function(options) {
        options = options || {};
        if (options.userBasedPosts) {
            console.log('check');
            this.url = 'http://localhost/toonflix/api/posts/get_user_posts'; 
        }
    },
});
