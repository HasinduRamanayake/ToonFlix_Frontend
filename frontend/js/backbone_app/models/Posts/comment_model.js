var CommentModel = Backbone.Model.extend({
    url: function() {
        if (this.isNew()) {
            return 'http://localhost/toonflix/api/comments/create_comment';
        } else if (this.get('destroyed')) {
            return 'http://localhost/toonflix/api/comments/delete_comment/' + encodeURIComponent(this.id);
        } else {
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
            this.set('destroyed', true); // Set Destroyeed
        });
    }
    
});
