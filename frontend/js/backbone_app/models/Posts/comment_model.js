
var CommentModel = Backbone.Model.extend({
    url: function() {
        return 'http://localhost/toonflix/api/comments/create_comment';       
    },
    defaults: {
        post:{},        
        content: '',
        created_at: '',  
        user:{}  
    }
  
});