
var PostModel = Backbone.Model.extend({
    url: function() {
        var base = 'http://localhost/toonflix/api/posts/';
        if (this.isNew()) {
            return base + 'create_post'; // For creating new posts
        }
        return base + this.id; // For fetching a specific post
    },
    defaults: {
        title: '',
        genre: '',
        description: '',
        tag: '',
        image_path: '',
        username: ''
    }
  
});