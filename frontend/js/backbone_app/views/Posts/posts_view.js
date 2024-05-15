var PostsCollectionView = Backbone.View.extend({
    initialize: function() {
        this.collection = new PostsCollection();
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        // Fetching the template HTML
        $.get('html/dashboard.html')
            .done(function(data) {
            
                var templateHtml = $("<div>").html(data).find('#home-template').html();
                if (templateHtml) {
                    self.template = _.template(templateHtml);
                    self.listenTo(self.collection, 'sync', self.render);
                    self.collection.fetch({reset: true}); 
                } else {
                    console.error('Template content not found.');
                }
            })
            .fail(function() {
                console.error('Failed to load the posts template.');
            });
    },

    render: function() {
        if (!this.template || this.collection.isEmpty()) {
            return this;  
        }

        // appending all the postsdata into an array to pass to the HTML template
        var postsData = this.collection.map(function(model) {
            return model.toJSON();
        });
        
        this.$el.html(this.template({ posts: postsData }));
        return this;
    },


});



