var DashboardView = Backbone.View.extend({
        
    // Initialization of the view
    initialize: function() {
        this.collection = new PostsCollection();
        this.loadTemplate();
    },
    loadTemplate: function() {
        var self = this;
        // Fetching the template HTML 
        $.get('html/dashboard.html', function(data) {
            var wrapper = $("<div>").html(data);
            self.homeTemplate = _.template(wrapper.find('#home-template').html());
            self.postsTemplate = _.template(wrapper.find('#post-template').html());
            if (self.homeTemplate && self.postsTemplate) {
                
                self.listenTo(self.collection, 'sync', self.render);  // Listening for the collection sync event
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

    // Rendering the template content
    render: function() {
        if (this.homeTemplate && this.postsTemplate && !this.collection.isEmpty()) {
            this.$el.html(this.homeTemplate()); 
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
