
var CommentModel = Backbone.Model.extend({
    url: function() {
        var base = 'http://localhost/toonflix/api/comments/';
        if (this.isNew()) {
            return base + 'create_comment'; // For creating new posts
        }
        return base + this.id; // For fetching a specific post
    },
    defaults: {
        postId: '',        
        content: '',
        timestamp: '',
        username: ''
    }
  
});