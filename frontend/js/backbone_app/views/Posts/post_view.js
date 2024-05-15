var PostDetailView = Backbone.View.extend({
   
    events: {
        'submit .comment-form': 'createComment',
        'click .delete-comment-button': 'deleteComment',
        'click .edit-comment-button': 'toggleEdit',
        'click .save-comment-button': 'saveComment',
        'click .cancel-comment-button': 'toggleEdit',
        'click .like-post': 'likePost',
        'click .follow-user': 'followUser'
    },
    initialize: function(options) {
        // options.id will contain the ID of the post to fetch
        
        this.model = new PostModel({id: options.id});        
        this.collection = new CommentsCollection({id: options.id});
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        this.currentUserId = this.currentUser.data.userId;
        this.listenTo(this.collection, 'update', this.commentRender);
        this.listenTo(this.collection, 'add', this.commentRender);
        this.listenTo(this.model, 'update', this.postRender);
        console.log('UserID',this.currentUserId);
        this.loadTemplate(); 
    },

    loadTemplate: function() {
        var self = this;
        $.get('html/post.html').done(function(data) {
            var wrapper = $("<div>").html(data); 
            self.postTemplate = _.template(wrapper.find('#post-detail-template').html());
            self.commentTemplate = _.template(wrapper.find('#comment-detail-template').html());
            self.commentFormTemplate = _.template(wrapper.find('#comment-form-detail-template').html());
            
            if (self.postTemplate && self.commentTemplate && self.commentFormTemplate) {
                self.model.fetch().done(function(response) {
                    var responseData = self.model.get('data') || {};
    
                    var likes = responseData.likes || [];
                    var followers = responseData.followers || [];
                    var postUserId = responseData.user_id;
                    var postUsername = responseData.username;
                    
    
                    console.log('likes', responseData);
                    console.log('likes', likes);
                    console.log('USERPOSTName', postUsername);
    
                    // Checking if any of the likes belong to the current user
                    var likedByCurrentUser = likes.some(function(like) {
                        return like.user_id == self.currentUserId && responseData.id == self.model.id;
                    });
    
                    // Checking if the current user is following the post's user
                    var followedByCurrentUser = followers.some(function(follower) {
                        return follower.id == self.currentUserId;
                    });
    
                    console.log('likedByCurrentUser', likedByCurrentUser);
                    console.log('followedByCurrentUser', followedByCurrentUser);
    
                    self.model.set('likedByCurrentUser', likedByCurrentUser);
                    self.model.set('followedByCurrentUser', followedByCurrentUser);
                    self.model.set('postUserId', postUserId);
                    self.model.set('username',postUsername);
    
                    self.postRender();
    
                    // Fetch comments
                    self.collection.fetch({
                        reset: true,
                        success: function(collection) {
                            console.log("Comments fetch success", collection);
                            // Render comments and form 
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
    

    postRender: function() {
        var modelData = this.model.toJSON();
        var data = modelData.data;
        var isLiked = this.model.get('likedByCurrentUser');
        var isFollowed = this.model.get('followedByCurrentUser');
        var postUserId = this.model.get('postUserId');
        
        if (this.postTemplate) {
            this.$el.html(this.postTemplate(_.extend(data, {
                likedByCurrentUser: isLiked,
                followedByCurrentUser: isFollowed,
                currentUserId: this.currentUserId,
                postUserId: postUserId
            })));
            
            var likeButton = this.$('.like-post');
            likeButton.toggleClass('liked', isLiked);
            likeButton.find('i').toggleClass('fas fa-heart far fa-heart');
            
            // Update the follow button icon color
            var followButton = this.$('.follow-user');
            followButton.toggleClass('followed', isFollowed);
    
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
                commentsHtml = this.commentTemplate({ comments: commentsJson, currentUserId: this.currentUserId });
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
        var userData = localStorage.getItem('user');
        var comment = new CommentModel({
            content: content,
            post_id: this.model.id,
            user: {username:JSON.parse(userData).username}

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
        
        
        var isLiked = this.model.get('likedByCurrentUser');
        
        // Selecting the API endpoint based on whether the post is already liked or not
        var endpoint = isLiked ? 'remove_like' : 'add_like';
        var methodType = isLiked ? 'DELETE' : 'POST';
        
        // sending request to the server to like/unlike the post
        $.ajax({
            url: 'http://localhost/toonflix/api/likes/' + endpoint + '/' + postId,
            type: methodType,
            success: function(response) {
                console.log('Post ' + (isLiked ? 'unliked' : 'liked') + ' successfully:', response);
                
                // Updatign the model with the new like status
                self.model.set('likedByCurrentUser', !isLiked);
                
                // Updating the button ICon
                var likeButton = self.$('.like-post');
                likeButton.toggleClass('liked', !isLiked);
                likeButton.find('i').toggleClass('fas fa-heart far fa-heart');  

                // Triggering a model change event 
                self.model.trigger('change:likedByCurrentUser');

            },
            error: function(xhr, status, error) {
                console.error('Failed to ' + (isLiked ? 'unlike' : 'like') + ' post:', error);
            }
        });
    },

    followUser: function(e) {
        e.preventDefault();
        var self = this;
        var postUserId = this.model.get('postUserId');
        
        var isFollowed = this.model.get('followedByCurrentUser');
        
        var endpoint = isFollowed ? 'unfollow' : 'follow';
        var methodType = 'POST';
        
        $.ajax({
            url: 'http://localhost/toonflix/api/user/' + endpoint + '/' + this.currentUserId + '/' + postUserId,
            type: methodType,
            success: function(response) {
                console.log('User ' + (isFollowed ? 'unfollowed' : 'followed') + ' successfully:', response);
                
                self.model.set('followedByCurrentUser', !isFollowed);
                
                var followButton = self.$('.follow-user');
                followButton.toggleClass('followed', !isFollowed);

                self.model.trigger('change:followedByCurrentUser');
                Swal.fire({
                    icon: 'success',
                    title: 'You '+ (isFollowed ? 'Unfollowed ' : 'Followed ') +  self.model.get('username') + ' successfully!' 
                                    
                }); 
            },
            error: function(xhr, status, error) {
                console.error('Failed to ' + (isFollowed ? 'unfollow' : 'follow') + ' user:', error);
            }
        });
    },
    

    toggleEdit: function(e) {
        e.preventDefault();
        
        var $commentContainer = $(e.currentTarget).closest('.comment-item');
    
        var isEditing = $commentContainer.find('.edit-comment-text').is(':visible');
    
        if (isEditing) {
            // Switch To view mode
            $commentContainer.find('.comment-text, .edit-comment-button, .delete-comment-button').show();
            $commentContainer.find('.edit-comment-text, .save-comment-button, .cancel-comment-button').hide();
        } else {
            // Switch to edit Mode
            $commentContainer.find('.comment-text, .edit-comment-button, .delete-comment-button').hide();
            $commentContainer.find('.edit-comment-text, .save-comment-button, .cancel-comment-button').show();
        }
    },
    
    
    

    saveComment: function(e) {
        var commentId = $(e.currentTarget).data('id');
        var commentText = this.$('.edit-comment-text[data-id="' + commentId + '"]').val();
        var comment = this.collection.get(commentId);

        if (comment) {
            comment.save({content: commentText}, {
                success: (model, response) => {
                    this.commentRender();  // Rerendering the all comments
                    this.toggleEdit(e);    // Toggle back to view mode
                },
                error: (model, response) => {
                    console.error('Failed to update comment:', response);
                }
            });
        }
    },

    cancelEdit: function() {
        this.toggleEdit();
    },

    deleteComment: function(e) {
        e.preventDefault();
        var commentId = $(e.currentTarget).data('id');
        var comment = this.collection.get(commentId);
    
        if (comment) {
            comment.set('destroyed', true); // Setting the destroyed flag
            comment.destroy({
                success: (model, response) => {
                    console.log('Comment deleted successfully:', response);
                    this.commentRender();  // Rerender the comment list
                },
                error: (model, response) => {
                    console.error('Failed to delete comment:', response);
                }
            });
        }
    }
    

   
});
