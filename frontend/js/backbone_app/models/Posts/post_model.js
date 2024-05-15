
var PostModel = Backbone.Model.extend({
    url: function() {
        var base = 'http://localhost/toonflix/api/posts/';
        if (this.isNew()) {
            return base + 'create_post'; 
        } else if (this.destroyed) {
            return base + 'delete_post/' + encodeURIComponent(this.id); 
        } else if ( this.hasChanged() && !this.destroyed) {
            return base + 'update_post/' + encodeURIComponent(this.id); 
        } else {
            return base + 'get_post/' + encodeURIComponent(this.id); 
        }
         
    },
    defaults: {
        title: '',
        genre: '',
        description: '',
        tag: '',
        image_path: '',
        likes: '',
        likeCount: '',
        username: '',
        createdAt:'',
        user_id:''
    },

    initialize: function() {
        this.on("destroy", function() {
            this.destroyed = true; //marking this as to be destroyed when the model is getting deleted
        });
        
    },  
});