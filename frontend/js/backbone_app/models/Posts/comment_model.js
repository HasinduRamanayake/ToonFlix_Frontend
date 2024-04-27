var CommentModel = Backbone.Model.extend({
    url: function() {
        if (this.id) {
            // If the model has an ID, check if it's being destroyed
            if (this.isNew()) {
                // isNew() is false if the model has never been saved to the server, which implies creation
                return 'http://localhost/toonflix/api/comments/create_comment';
            } else {
                // Check if the model has been marked for deletion
                if (this.hasChanged() && !this.destroyed) {
                    // If the model has changes and it's not marked as destroyed, it's an update
                    return 'http://localhost/toonflix/api/comments/update_comment/' + encodeURIComponent(this.id);
                } else {
                    // If it's marked as destroyed
                    return 'http://localhost/toonflix/api/comments/delete_comment/' + encodeURIComponent(this.id);
                }
            }
        } else {
            // No ID means it's a new comment that needs to be created
            return 'http://localhost/toonflix/api/comments/create_comment';
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
            this.destroyed = true; // Mark this model as destroyed
        });
    }
});
