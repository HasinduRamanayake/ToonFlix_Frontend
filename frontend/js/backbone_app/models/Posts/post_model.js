
var PostModel = Backbone.Model.extend({
    urlRoot: 'http://localhost/toonflix/api/posts/create_post', 
    defaults: {
        title: '',
        image: null 
    }
});

