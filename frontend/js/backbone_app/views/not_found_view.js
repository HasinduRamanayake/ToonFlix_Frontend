var NotFoundView = Backbone.View.extend({
        
    
    initialize: function() {
        this.loadTemplate();
    },
    loadTemplate: function() {
        var self = this;
        // Fetching the template HTML
        $.get('html/not_found.html', function(data) {
            var templateHtml = $("<div>").html(data).find('#not-found-template').html();
            if (templateHtml) {
                self.template = _.template(templateHtml);
                self.render();                
            } else {
                console.error('Template content not found.');
            }
            
        }).fail(function() {
            console.error('Failed to load the dashboard template.');
        });
    },

    // Render the template
    render: function() {
        if (this.template) {
            this.$el.html(this.template());
           
        } else {
            console.error('Template not loaded yet.');
        }
        return this;
    },
});
