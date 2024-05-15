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
                console.log('HEY');
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
            console.log('Session Check');
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
                    console.log('DG', e.status);
                    reject('Session Check Failed');
                }
            });
        });
    },
    
    
    
    
};
