var CommentsCollection = Backbone.Collection.extend({
    model: CommentModel,
    initialize: function(options) {
        this.postId = options.id;
    },
    url: function() {
        return 'http://localhost/toonflix/api/comments/get_all_comments/' + this.postId;
    }
});