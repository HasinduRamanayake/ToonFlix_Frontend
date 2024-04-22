var PostsCollectionView = Backbone.View.extend({
    initialize: function() {
        this.collection = new PostsCollection();
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        // Fetch the template HTML from an external file
        $.get('html/postCollectionView.html')
            .done(function(data) {
                // Ensure the template element is correctly found within the fetched data
                var templateHtml = $("<div>").html(data).find('#post-template').html();
                if (templateHtml) {
                    self.template = _.template(templateHtml);
                    self.listenTo(self.collection, 'sync', self.render);  // Listen for the sync event
                    self.collection.fetch({reset: true});  // Fetch the collection data
                } else {
                    console.error('Template content not found.');
                }
            })
            .fail(function() {
                console.error('Failed to load the posts template.');
            });
    },

    render: function() {
        // Ensure the template is loaded and the collection is fetched before rendering
        if (!this.template || this.collection.isEmpty()) {
            return this;  // Exit if the template isn't loaded or the collection is empty
        }

        // Render the posts
        var postsData = this.collection.map(function(model) {
            return model.toJSON();
        });
        
        this.$el.html(this.template({ posts: postsData }));
        return this;
    },

    close: function() {
        this.remove();  // Remove the view from the DOM
        this.unbind();  // Unbind all local event bindings
        if (this.collection) {
            this.collection.unbind();  // Unbind references to the collection
        }
    }
});