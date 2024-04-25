var PostDetailView = Backbone.View.extend({
    initialize: function(options) {
        // options.id will contain the ID of the post to fetch
        this.model = new PostModel({id: options.id});
        this.collection = new CommentsCollection();
        this.loadTemplate(); // Load the template as part of the initialization
    },

    loadTemplate: function() {
        var self = this; // To handle scoping properly for callbacks

        // Fetch the template HTML from an external file
        $.get('html/post.html')
            .done(function(data) {
             
                var wrapper = $("<div>").html(data); 
                self.postTemplate = _.template(wrapper.find('#post-detail-template').html());
                self.commentTemplate = _.template(wrapper.find('#comment-detail-template').html());
                if (self.postTemplate) {                   
                    self.listenTo(self.model, 'sync', self.render); 
                    self.model.fetch(); 
                }if(self.commentTemplate){
                    self.listenTo(self.collection, 'sync',self.render);
                    self.collection.fetch({reset: true});
                }else{
                    console.error('Template content not found.');
                }   
                
            })
            .fail(function() {
                console.error('Failed to load the posts template.');
            });
    },

    render: function() {
      
        var modelData = this.model.toJSON();
        var data = modelData.data;
        
        if (this.postTemplate && this.commentTemplate && !this.collection.isEmpty()) {
            this.$el.html(this.postTemplate(data));
            this.$el.append(this.commentTemplate({ comments: this.collection.toJSON() }));
            
        } else {
            console.error('Template has not been loaded.');
        }
        return this;
    }
});
