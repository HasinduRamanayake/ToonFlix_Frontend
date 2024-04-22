var PostFormView = Backbone.View.extend({
    el: '#app',

    events: {
        'submit': 'submitPost'
    },

    initialize: function() {
        var self = this;
        this.model = new PostModel();
        $.get('html/post_create.html', function(data) {
            self.template = data;
            self.render();
        });
    },
    render: function() {
        
        this.$el.html(this.template);        
        return this;
    },

    submitPost: function(e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append('title', this.$('#title').val());
        formData.append('description', this.$('#description').val());
        formData.append('image', this.$('#image')[0].files[0]);

        this.model.save(null, {
            data: formData,
            processData: false,
            contentType: false,
            success: function(model, response) {
                console.log('Successfully uploaded post:', response);
            },
            error: function(model, response) {
                console.log('Failed to upload post:', response);
            }
        });
    }    
    
});




