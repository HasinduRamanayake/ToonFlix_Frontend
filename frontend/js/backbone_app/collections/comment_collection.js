var CommentsCollection = Backbone.Collection.extend({
    url: 'http://localhost/toonflix/api/posts/get_all_posts',
    model: CommentModel
});


