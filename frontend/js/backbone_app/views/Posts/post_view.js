var PostDetailView = Backbone.View.extend({
    events: {
        'submit': 'createComment'
    },

    initialize: function(options) {
        // options.id will contain the ID of the post to fetch
        this.model = new PostModel({id: options.id});        
        this.collection = new CommentsCollection({id: options.id});
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
                self.model.fetch().done(function() {
                    // Once post is fetched, render it
                    self.postRender();
    
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

    postRender: function() {
      
        var modelData = this.model.toJSON();
        var data = modelData.data;
        
        if (this.postTemplate ) {
            this.$el.html(this.postTemplate(data));
           
            
        } else {
            console.error('Template has not been loaded.');
        }
        return this;
    },
   
    commentRender: function() {
        console.log('inCommentRender');
        var commentsHtml = '';
        
        if (this.commentTemplate) {
            var commentsJson = this.collection.toJSON();
            if (!this.collection.isEmpty()) {
                commentsHtml = this.commentTemplate({ comments: commentsJson });
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
        console.log('inCommentRenderForm',this.commentFormTemplate());
        this.$el.append(this.commentFormTemplate());
    },

    createComment: function(e){
        e.preventDefault();


        var content = this.$('#content').val();
        var comment = new CommentModel({
            content: content,
            post_id: this.model.id
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
    }
});
