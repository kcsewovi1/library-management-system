document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript loaded');

    // Function to show a specific form and hide others
    function showForm(formId) {
        document.querySelectorAll('form').forEach(form => {
            form.classList.add('hidden');
        });
        document.getElementById(formId).classList.remove('hidden');
    }

    // Function to show a message
    function showMessage(message, success) {
        const messageDiv = document.createElement('div');
        messageDiv.className = success ? 'success-message' : 'error-message';
        messageDiv.innerText = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Function to clear form inputs
    function clearForm(form) {
        form.reset(); // Reset form fields
    }

    // Event listeners for showing forms
    document.getElementById('registerBtn').addEventListener('click', () => {
        showForm('registerForm');
    });

    document.getElementById('addBookBtn').addEventListener('click', () => {
        showForm('addBookForm');
    });

    document.getElementById('deleteBookBtn').addEventListener('click', () => {
        showForm('deleteBookForm');
    });

    document.getElementById('updateBookBtn').addEventListener('click', () => {
        showForm('updateBookForm');
    });

    document.getElementById('viewBooksBtn').addEventListener('click', () => {
        showForm('viewBooksForm');
    });

    // Form submission handler for register form
    document.getElementById('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) {
                alert(`Your user ID is ${data.user_id}. Please keep it safe for later usage.`);
                clearForm(this); // Clear the form after successful submission
            }
        });
    });

    // Form submission handler for addBook form
    document.getElementById('addBookForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) clearForm(this); // Clear the form after successful submission
        });
    });

    // Form submission handler for deleteBook form
    document.getElementById('deleteBookForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        fetch(`/deleteBook`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) clearForm(this); // Clear the form after successful deletion
        });
    });

    // Form submission handler for updateBook form
    document.getElementById('updateBookForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        fetch(`/updateBook`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.message, data.success);
            if (data.success) clearForm(this); // Clear the form after successful update
        });
    });

    // Form submission handler for viewBooks form
    document.getElementById('viewBooksForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
    
        fetch(`/books/${data.user_id}`)
            .then(response => response.json())
            .then(data => {
                let booksDiv = document.getElementById('books');
                booksDiv.innerHTML = ''; // Clear previous results
    
                if (data.success) {
                    if (data.books && data.books.length > 0) {
                        data.books.forEach(book => {
                            booksDiv.innerHTML += `
                                <div class="book-card">
                                    <p><strong>Title:</strong> ${book.title}</p>
                                    <p><strong>Author:</strong> ${book.author}</p>
                                    <p><strong>Genre:</strong> ${book.genre}</p>
                                    <p><strong>Published Date:</strong> ${book.published_date}</p>
                                    <p><strong>Book ID:</strong> ${book.id}</p>
                                </div>`;
                        });
                    } else {
                        booksDiv.innerHTML = `<p>No books found for this user ID.</p>`;
                    }
                } else {
                    booksDiv.innerHTML = `<p>${data.message}</p>`;
                }
            })
            .catch(error => {
                let booksDiv = document.getElementById('books');
                booksDiv.innerHTML = `<p>An error occurred: ${error.message}</p>`;
            });
    });
    
    // document.getElementById('viewBooksForm').addEventListener('submit', function (e) {
    //     e.preventDefault();
    //     const formData = new FormData(this);
    //     const data = Object.fromEntries(formData.entries());
    
    //     fetch(`/books/${data.user_id}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             let booksDiv = document.getElementById('books');
    //             booksDiv.innerHTML = ''; // Clear previous results
    //             data.forEach(book => {
    //                 booksDiv.innerHTML += `
    //                     <div class="book-card">
    //                         <p><strong>Title:</strong> ${book.title}</p>
    //                         <p><strong>Author:</strong> ${book.author}</p>
    //                         <p><strong>Genre:</strong> ${book.genre}</p>
    //                         <p><strong>Published Date:</strong> ${book.published_date}</p>
    //                         <p><strong>Book ID:</strong> ${book.id}</p>
    //                     </div>`;
    //             });
    //         });
    // });
    
});
