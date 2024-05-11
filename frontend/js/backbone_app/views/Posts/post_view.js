var PostDetailView = Backbone.View.extend({
   
    events: {
        'submit .comment-form': 'createComment',
        'click .delete-comment': 'deleteComment',
        'click .edit-comment': 'toggleEdit',
        'click .save-comment': 'saveComment',
        'click .cancel-comment': 'toggleEdit',
        'click .like-post': 'likePost',
    },
    initialize: function(options) {
        // options.id will contain the ID of the post to fetch
        
        this.model = new PostModel({id: options.id});        
        this.collection = new CommentsCollection({id: options.id});
        this.currentUser = options.currentUser;
        this.listenTo(this.collection, 'update', this.commentRender);
        this.listenTo(this.collection, 'add', this.commentRender);
        this.listenTo(this.model, 'update', this.postRender);
        console.log('UserID',this.currentUser);
        this.loadTemplate(); // Load the template as part of the initialization
    },

    loadTemplate: function() {
        var self = this;
        $.get('html/post.html').done(function(data) {
            var wrapper = $("<div>").html(data); 
            self.postTemplate = _.template(wrapper.find('#post-detail-template').html());
            self.commentTemplate = _.template(wrapper.find('#comment-detail-template').html());
            self.commentFormTemplate = _.template(wrapper.find('#comment-form-detail-template').html());
            
            if (self.postTemplate && self.commentTemplate && self.commentFormTemplate) {
                // Fetch post data first
                self.model.fetch().done(function(response) {
                    var responseData = self.model.get('data') || {};

                    // Now, access likes from the responseData
                    var likes = responseData.likes || [];

                    console.log('likes',responseData);
                   
                    console.log('likes',likes);
                    // Check if any of the likes belong to the current user
                    var likedByCurrentUser = likes.some(function(like) {
                        return like.user_id == self.currentUser && responseData.id == self.model.id;
                    });
                    console.log(likedByCurrentUser)
                    self.model.set('likedByCurrentUser', likedByCurrentUser);

                    self.postRender(likedByCurrentUser);
    
                    // Then fetch comments
                    self.collection.fetch({
                        reset: true,
                        success: function(collection) {
                            console.log("Comments fetch success", collection);
                            // Render comments and form after comments are fetched
                            self.commentRender();
                            self.commentFormRender();
                        },
                        error: function(collection, response) {
                            console.error("Comments fetch failed", response);
                            // Even if comments fetch fails, you might still want to render the form
                            self.commentFormRender();
                        }
                    });
                }).fail(function(response) {
                    console.error("Post fetch failed", response);
                });
            } else {
                console.error('Template content not found.');
            }
        }).fail(function() {
            console.error('Failed to load the post template.');
        });
    },

    postRender: function(isLiked) {
        // Instead of passing isLiked as an argument, get it from the model directly
        var modelData = this.model.toJSON();
        var data = modelData.data;
        var isLiked = this.model.get('likedByCurrentUser');
        
        if (this.postTemplate) {
            this.$el.html(this.postTemplate(_.extend(data, { likedByCurrentUser: isLiked })));
            
            // Update the like button text and class
            var likeButton = this.$('.like-post');
            likeButton.text(isLiked ? 'Unlike' : 'Like');
            likeButton.toggleClass('liked', isLiked);

            // Ensure that events are delegated after rendering
            this.delegateEvents();
        } else {
            console.error('Template has not been loaded.');
        }
        return this;
    },
    
   
    commentRender: function() {
      
        var commentsHtml = '';
        
        if (this.commentTemplate) {
            var commentsJson = this.collection.toJSON();
            if (!this.collection.isEmpty()) {
                commentsHtml = this.commentTemplate({ comments: commentsJson, currentUser: this.currentUser });
            } else {
                commentsHtml = "<div class='no-comments'>No comments. Be the first one to respond.</div>";
            }
        } else {
            console.error('Template has not been loaded.');
        }
        
        
        this.$('.comments-container').html(commentsHtml);
        
        return this;
    },
    

    commentFormRender: function(){
        
        this.$el.append(this.commentFormTemplate());
    },

    createComment: function(e){
        e.preventDefault();
        
        var content = this.$('#content').val();
        var comment = new CommentModel({
            content: content,
            post_id: this.model.id,
            user: {username:'Lofy'} //Need to Replace with JWT

        });

        comment.save(null, {
            success: (model, response) => {
                console.log('Comment added successfully:', response);
                this.collection.add(model); 
                this.commentRender();
            },
            error: (model, response) => {
                console.error('Failed to add comment:', response);
            }
        });
    },

    likePost: function(e){
        e.preventDefault();
        var self = this;
        var postId = this.model.id;
        
        // Check if the post is already liked by the user
        var isLiked = this.model.get('likedByCurrentUser');
        
        // Determine the API endpoint based on whether the post is already liked or not
        var endpoint = isLiked ? 'remove_like' : 'add_like';
        var methodType = isLiked ? 'DELETE' : 'POST';
        
        // Send a request to the server to like/unlike the post
        $.ajax({
            url: 'http://localhost/toonflix/api/likes/' + endpoint + '/' + postId,
            type: methodType,
            success: function(response) {
                console.log('Post ' + (isLiked ? 'unliked' : 'liked') + ' successfully:', response);
                
                // Update the model with the new like status
                self.model.set('likedByCurrentUser', !isLiked);
                
                // Update the button directly, rather than re-rendering the whole post
                var likeButton = self.$('.like-post');
                likeButton.text(!isLiked ? 'Unlike' : 'Like'); // Switch the text based on new like status
                likeButton.toggleClass('liked', !isLiked); // Toggle the class based on new like status

                // Optionally trigger a model change event to update other parts of the view
                self.model.trigger('change:likedByCurrentUser');
            },
            error: function(xhr, status, error) {
                console.error('Failed to ' + (isLiked ? 'unlike' : 'like') + ' post:', error);
            }
        });
    },
    

    toggleEdit: function(e) {
        e.preventDefault();  
        
        
        console.log("Toggle edit called");
        var commentId = $(e.currentTarget).data('id');
        var selector = '[data-id="' + commentId + '"]';
        var isEditing = this.$(selector + ' .edit-comment-text').is(':visible');
    
        console.log("Is editing:", isEditing);

        if (isEditing) {
            // Hide edit controls
            this.$(selector + ' .edit-comment-text').css('display', 'none');
            this.$(selector + ' .comment-text').css('display', 'block');
            this.$(selector + ' .edit-comment').css('display', 'inline');
            this.$(selector + ' .delete-comment').css('display', 'inline');
            this.$(selector + ' .save-comment').css('display', 'none');
            this.$(selector + ' .cancel-comment').css('display', 'none');
        } else {
            // Show edit controls
            this.$(selector + ' .edit-comment-text').css('display', 'block');
            this.$(selector + ' .comment-text').css('display', 'none');
            this.$(selector + ' .edit-comment').css('display', 'none');
            this.$(selector + ' .delete-comment').css('display', 'none');
            this.$(selector + ' .save-comment').css('display', 'inline');
            this.$(selector + ' .cancel-comment').css('display', 'inline');
        }
    },

    saveComment: function(e) {
        var commentId = $(e.currentTarget).data('id');
        var commentText = this.$('.edit-comment-text[data-id="' + commentId + '"]').val();
        var comment = this.collection.get(commentId);

        if (comment) {
            comment.save({content: commentText}, {
                success: (model, response) => {
                    this.commentRender();  // Re-render to show updated comment
                    this.toggleEdit(e);    // Toggle back to view mode
                },
                error: (model, response) => {
                    console.error('Failed to update comment:', response);
                }
            });
        }
    },

    cancelEdit: function(e) {
        var commentId = $(e.currentTarget).data('id');
        this.commentRender();  // Just re-render the comments to reset edit states
    },

    deleteComment: function(e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).data('id');
        var comment = this.collection.get(commentId);

        if (comment) {
            comment.destroy({
                success: (model, response) => {
                    console.log('Comment deleted successfully:', response);
                    this.commentRender();  // Re-render the comment list
                },
                error: (model, response) => {
                    console.error('Failed to delete comment:', response);
                }
            });
        }
    }

   
});
