var CommentsCollection = Backbone.Collection.extend({
    url: 'http://localhost/toonflix/api/comments/get_all_comments',
    model: CommentModel
});


