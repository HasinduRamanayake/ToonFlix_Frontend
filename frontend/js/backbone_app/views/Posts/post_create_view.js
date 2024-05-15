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

    validateImage: function(file) {
        
        if (file.size > 5242880) { 
            Swal.fire({
                icon: 'error',
                title: 'File size should be less than 5Mb'
                                
            }); 
            return false;
        }
        return true;
    },

    submitPost: function(e) {
        e.preventDefault();

        var formData = new FormData(e.target); 
        //considering only the first image from the selection
        var imageInput = this.$('#image')[0];
        if (imageInput.files.length > 0) {
            var file = imageInput.files[0];
            if (this.validateImage(file)) {

                var tags = this.$('#tags').val().split(',').map(function(tag) { return tag.trim(); });
                formData.append('tags', JSON.stringify(tags)); 
        
                this.model.save(null, {
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: (response) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Post Created Succesfully'
                                            
                        }); 
                        this.model.set(this.model.defaults); // Reset model and rerender after success of the request
                        this.render(); 
                    },
                    error: (model, response) => {
                        
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to upload post:' + response.responseText                                            
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid image. Please select an image file (e.g., jpg, png, jpeg).'                                     
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Please Select an Image!'                                     
            });
        }
       
    }
});
