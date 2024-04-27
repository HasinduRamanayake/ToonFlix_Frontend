
var PostModel = Backbone.Model.extend({
    url: function() {
        var base = 'http://localhost/toonflix/api/posts/';
        if (this.isNew()) {
            return base + 'create_post'; // For creating new posts
        } else if (this.destroyed) {
            return base + 'delete_post/' + encodeURIComponent(this.id); // For deleting a post
        } else if ( this.hasChanged() && !this.destroyed) {
            return base + 'update_post/' + encodeURIComponent(this.id); // For updating a post
        } else {
            return base + 'get_post/' + encodeURIComponent(this.id); // For fetching a specific post
        }
         
    },
    defaults: {
        title: '',
        genre: '',
        description: '',
        tag: '',
        image_path: '',
        username: '',
        createdAt:'',
    },

    initialize: function() {
        this.on("destroy", function() {
            this.destroyed = true; // Mark this model as destroyed when destroy is called
        });
        
    },  
});