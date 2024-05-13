var DashboardView = Backbone.View.extend({
        
    // Initialization function
    initialize: function() {
        this.collection = new PostsCollection();
        this.loadTemplate();
    },
    loadTemplate: function() {
        var self = this;
        // Fetch the template HTML from an external file
        $.get('html/dashboard.html', function(data) {
            var wrapper = $("<div>").html(data); // Wrap the data in a div for easier manipulation
            self.homeTemplate = _.template(wrapper.find('#home-template').html());
            self.postsTemplate = _.template(wrapper.find('#post-template').html());
            if (self.homeTemplate && self.postsTemplate) {
                 // Render the view once both templates are loaded
                self.listenTo(self.collection, 'sync', self.render);  // Listen for the sync event
                self.collection.fetch({
                    reset: true,
                    error: function() {
                        Swal.fire({
                            icon: 'info',
                            title: 'Oops...',
                            text: 'No Posts in the Database',
                            footer: 'Be the first one to create post'
                        });
                       
                    }
                });
            } else {
                console.error('Template content not found.');
            }
            
        }).fail(function() {
            console.error('Failed to load the dashboard template.');
        });
    },

    // Render the template content
    render: function() {
        if (this.homeTemplate && this.postsTemplate && !this.collection.isEmpty()) {
            this.$el.html(this.homeTemplate()); 
            console.log("Posts: ", this.collection.toJSON())
            this.$el.append(this.postsTemplate({ posts: this.collection.toJSON() })); 

            this.initializeSwiper();
        } else {
            console.error('Templates not loaded or collection is empty.');
        }              
        
    },

    
    initializeSwiper: function() {
        new Swiper('.swiper', {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination'
            },
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            }
        });
    },
    removeView: function() {      
        this.undelegateEvents();       
        this.$el.remove();        
        this.stopListening();        
    },
});
