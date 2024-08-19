document.getElementById('add-book-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const publishedYear = document.getElementById('published_year').value;

    const response = await fetch('/books/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, published_year: parseInt(publishedYear) }),
    });

    if (response.ok) {
        alert('Book added successfully!');
        document.getElementById('add-book-form').reset();
    } else {
        alert('Failed to add book.');
    }
});

document.getElementById('list-books-btn').addEventListener('click', async function() {
    const response = await fetch('/books/');
    const books = await response.json();

    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';

    books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.id}: ${book.title} by ${book.author} (${book.published_year})`;
        booksList.appendChild(li);
    });
});

document.getElementById('get-book-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const bookId = document.getElementById('book-id').value;

    const response = await fetch(`/books/${bookId}`);
    const book = await response.json();

    const bookDetails = document.getElementById('book-details');
    if (response.ok) {
        bookDetails.textContent = `ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Published Year: ${book.published_year}, Borrowed: ${book.is_borrowed}`;
    } else {
        bookDetails.textContent = 'Book not found.';
    }
});

document.getElementById('borrow-book-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const bookId = document.getElementById('borrow-book-id').value;
    const user = document.getElementById('borrow-user').value;

    try {
        const response = await fetch('/books/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ book_id: parseInt(bookId), user: user })
        });

        const result = await response.json();

        const borrowStatus = document.getElementById('borrow-status');
        if (response.ok) {
            borrowStatus.innerText = result.message;
        } else {
            borrowStatus.innerText = result.detail || 'An error occurred';
        }
    } catch (error) {
        document.getElementById('borrow-status').innerText = 'Network error: ' + error.message;
    }
});

document.getElementById('list-borrowed-books-btn').addEventListener('click', async function() {
    const response = await fetch('/book/borrowed');
    const data = await response.json();

    const borrowedBooksList = document.getElementById('borrowed-books-list');
    borrowedBooksList.innerHTML = '';

    data.borrowed_books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Published Year: ${book.published_year}, Borrowed By: ${book.user}`;
        borrowedBooksList.appendChild(li);
    });
});

document.getElementById('return-book-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const bookId = document.getElementById('return-book-id').value;

    const response = await fetch('/books/return', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ book_id: parseInt(bookId) })
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('return-status').innerText = result.message;
    } else {
        document.getElementById('return-status').innerText = result.detail || 'An error occurred';
    }
});

document.getElementById('delete-book-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const bookId = document.getElementById('delete-book-id').value;

    const response = await fetch(`/delete_books/${bookId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('delete-status').innerText = result.message;
    } else {
        document.getElementById('delete-status').innerText = result.detail || 'An error occurred';
    }
});
