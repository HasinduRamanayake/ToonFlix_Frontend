var BlogPostView = Backbone.View.extend({
    events: {
        'click #search-button': 'fetchPosts', // Unified function for fetching posts
        'change [name="searchMode"]': 'toggleSearchInput'
    },

    initialize: function() {
        this.loadTemplate();
    },

    loadTemplate: function() {
        var self = this;
        $.get('html/blog_library.html', function(data) {
            var wrapper = $("<div>").html(data);
            self.blogPostTemplate = _.template(wrapper.find('#blog-post-template').html());
            self.postItemTemplate = _.template(wrapper.find('#post-item-template').html());
            if (self.blogPostTemplate && self.postItemTemplate) {
                self.render();
            } else {
                console.error('Template content not found.');
            }
        }).fail(function() {
            console.error('Failed to load the blog template.');
        });
    },

    toggleSearchInput: function() {
        if (this.$('#search-by-tag').is(':checked')) {
            this.$('#tags-input').show();
            this.$('#name-input').hide();
        } else {
            this.$('#tags-input').hide();
            this.$('#name-input').show();
        }
    },

    render: function() {
        if (this.blogPostTemplate) {
            this.$el.html(this.blogPostTemplate());
            this.delegateEvents();
        } else {
            console.error('Templates not loaded or collection is empty.');
        }
    },

    fetchPosts: function() {
        var url = 'http://localhost/toonflix/api/posts/search_by_tag';
        var data = {};

        if (this.$('#search-by-tag').is(':checked')) {
            var tags = this.$('#tags-input').val().split(',').map(tag => tag.trim());
            data.tags = encodeURIComponent(tags); 
        } else {
            var name = this.$('#name-input').val();
            url = 'http://localhost/toonflix/api/posts/search_by_name'; 
            data.name = name;
        }

        $.ajax({
            url: url,
            type: 'GET',
            data: data,
            success: function(response) {
                console.log('Posts fetched successfully:', response);
                if (response.data && response.data.length > 0) {
                    this.renderPosts(response.data);
                }
            }.bind(this),
            error: function() {
                Swal.fire({
                    icon: 'warning',
                    title:"No Posts were Found!"                               
                });
            }
        });
    },

    renderPosts: function(posts) {
        var self = this;
        var postsHtml = posts.map(function(post) {
            return self.postItemTemplate(post);
        }).join('');
        this.$('#posts-container').html(postsHtml);
    },
});
