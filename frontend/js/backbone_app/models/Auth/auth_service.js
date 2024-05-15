var AuthService = {
    signOut: function() {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to sign out?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, sign out!',
            cancelButtonText: 'No, stay here'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('user');  
        
                $.ajax({
                    url: 'http://localhost/toonflix/api/auth/signout',
                    type: 'POST',
                    success: function() {
                        Swal.fire({
                            icon: 'info',
                            title: 'Signed Out',
                            text: 'You have successfully signed out.',
                        });
                        Backbone.history.navigate('', { trigger: true });
                    },
                    error: function(xhr, status, error) {
                        console.error('Failed to SignOut', error);
                    }
                });       
            }
        });      
       
    },
    validateSession: function() {
        return new Promise((resolve, reject) => {
        // adopting asynchronous ways for non blocking behaviour to avoid corruptions on other processes when session checking is happening recently
            $.ajax({
                url: 'http://localhost/toonflix/api/auth/session_validity', 
                method: 'GET',
                success: function(response) {
                    if (!response.status) {
                        Backbone.history.navigate('', { trigger: true });
                        reject('Session Invalid');
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: `Session is Invalid. Please Login Again!`
                        });
                    } else {
                        resolve();
                    }
                },
                error: function(e) {
                    Backbone.history.navigate('', { trigger: true });
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Session Check Failed`
                    });
                    reject('Session Check Failed');
                }
            });
        });
    },
    
    
    
    
};
