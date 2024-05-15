var MyLibraryView = Backbone.View.extend({

    events: {
        "click .edit-post-button": "toggleEditMode",
        "click .save-updates-button": "saveUpdates",
        "click .cancel-updates-button": "toggleEditMode",
        "click .delete-post-button": "deletePost"
    },

    initialize: function() {
        this.model = new PostModel();
        this.collection = new PostsCollection({ userBasedPosts: true });
        this.listenTo(this.model, 'change', this.render);
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        $.get('html/my_library.html', function(data) {
            var wrapper = $("<div>").html(data);           
            self.libraryItemTemplate = _.template(wrapper.find('#my-library-template').html());
            if (self.libraryItemTemplate) {
                
                self.listenTo(self.collection, 'sync', self.renderPosts); 
                self.collection.fetch({reset: true,
                    error: function(e) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Oops...',
                            text: e.response,
                            footer: 'Be the first one to create post'
                        });
                       
                    }
                });                
            } else {
                console.error('Template content not found.');
            }
        }).fail(function() {
            console.error('Failed to load the library template.');
        });
    },

    
    
    renderPosts: function(posts) {
        var self = this; // Maintain the context for use in map function
        if (self.libraryItemTemplate) {
            var postsHtml = self.collection.map(function(postModel) {
                return self.libraryItemTemplate(postModel.toJSON());
            }).join('');

            self.$el.html(postsHtml); 
        } else {
            console.error('Templates not loaded or collection is empty.');
        }
    },

    toggleEditMode: function(e) {
        var $postContainer = $(e.target).closest('.post-edit-container');
        $postContainer.find('.post-title-view, .post-description-view, .post-tags-view, .edit-post-button, .delete-post-button').toggle();
        $postContainer.find('.post-title-edit, .post-description-edit, .post-tags-edit, .save-updates-button, .cancel-updates-button').toggle();
    },

    saveUpdates: function(e) {
        var $postContainer = $(e.target).closest('.post-edit-container');
        var postId = $postContainer.data('post-id');
        var postModel = this.collection.get(postId);
    
        if (!postModel) {
            console.error('No post found with the given ID.');
            return;
        }
    
        var attrs = {
            title: $postContainer.find('.post-title-edit').val(),
            description: $postContainer.find('.post-description-edit').val(),
            tags: $postContainer.find('.post-tags-edit').val().split(',').map(tag => tag.trim())
        };
        
        // Updating the model with new attributes and save(backbone reques methods) to server
        postModel.save(attrs, {
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                title: attrs.title,
                description: attrs.description,
                genre: attrs.genre,
                tags: JSON.stringify(attrs.tags) 
            }),
            processData: false,
            success: function() {
                Swal.fire({
                    icon: 'success',
                    title: 'Post Updated!',
                    text: e.response,
                    footer: 'Post updated successfully!'
                });
            },
            error: function(model, response) {
                console.error('Failed to update post:', response);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to update post',
                    text: 'Check you Connection!',
                });
            }
        });
    },


    deletePost: function(e) {
        e.preventDefault();
        var $postContainer = $(e.target).closest('.post-edit-container');
        var postId = $postContainer.data('post-id');
        var postModel = this.collection.get(postId);
    
        if (postModel) {
            postModel.destroyed = true; // Explicitly mark the model as destroyed
            postModel.destroy({
                wait: true,
                success: (model, response) => {
                    this.renderPosts();  // Re-rendering the posts after deletion
                    Swal.fire({
                        icon: 'success',
                        title: 'Post deleted successfully!',
                        text: e.response,                        
                    });
                },
                error: (model, response) => {
                    console.error('Failed to delete post:', response);
                }
            });
        } else {
            console.error("No model found with ID:", postId);
        }
    },
    

    cancelUpdates: function(event) {
        var $postContainer = $(event.target).closest('.post-edit-container');
        $postContainer.find('.edit-post-form').hide();
        $postContainer.find('.edit-post-button, .delete-post-button').show();
    },


   
});
