var CommentModel = Backbone.Model.extend({
    url: function() {
        if (this.isNew()) {
            // New comment
            return 'http://localhost/toonflix/api/comments/create_comment';
        } else if (this.destroyed) {
            // Deleted comment
            return 'http://localhost/toonflix/api/comments/delete_comment/' + encodeURIComponent(this.id);
        } else {
            // Updated comment
            return 'http://localhost/toonflix/api/comments/update_comment/' + encodeURIComponent(this.id);
        }
    },
    defaults: {
        post: {},        
        content: '',
        created_at: '',  
        user: {}  
    },
    initialize: function() {
        this.on("destroy", function() {
            this.destroyed = true; //Model to be destroyed 
        });
    }
});
