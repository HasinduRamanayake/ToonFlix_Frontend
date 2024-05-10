var PostFormView = Backbone.View.extend({
    el: '#app',

    events: {
        'submit #postForm': 'submitPost'
    },

    initialize: function() {
        this.model = new PostModel();
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        $.get('html/post_create.html', function(data) {
            self.template = _.template(data);
            self.render();
        });
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    submitPost: function(e) {
        e.preventDefault();

        var formData = new FormData(e.target);  // Automatically captures all form inputs including files
        
        // Additional handling for tags if necessary (split by commas, trim spaces, etc.)
        var tags = this.$('#tags').val().split(',').map(function(tag) { return tag.trim(); });
        formData.append('tags', JSON.stringify(tags));  // Ensure your backend can parse JSON

        this.model.save(null, {
            data: formData,
            processData: false,
            contentType: false,
            success: (model, response) => {
                console.log('Successfully uploaded post:', response);
                Swal.fire({
                    icon: 'success',
                    title: 'Post Created Succesfully'
                                    
                }); 
                this.model.set(this.model.defaults); // Reset model after successful submission
                this.render(); // Re-render the view to reset the form fields
            },
            error: (model, response) => {
                console.error('Failed to upload post:', response);
                alert('Failed to upload post: ' + response.responseText);
            }
        });
    }
});
