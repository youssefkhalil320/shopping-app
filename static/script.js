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

    const booksTableBody = document.querySelector('#books-table tbody');
    booksTableBody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.published_year}</td>
        `;
        booksTableBody.appendChild(row);
    });
});

document.getElementById('get-book-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const bookId = document.getElementById('book-id').value;

    const response = await fetch(`/books/${bookId}`);
    const book = await response.json();

    const bookDetailsTableBody = document.querySelector('#book-details-table tbody');
    bookDetailsTableBody.innerHTML = '';

    if (response.ok) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.published_year}</td>
            <td>${book.is_borrowed ? 'Yes' : 'No'}</td>
        `;
        bookDetailsTableBody.appendChild(row);
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5">Book not found.</td>`;
        bookDetailsTableBody.appendChild(row);
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

    const borrowedBooksTableBody = document.querySelector('#borrowed-books-table tbody');
    borrowedBooksTableBody.innerHTML = '';

    data.borrowed_books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.published_year}</td>
            <td>${book.user}</td>
        `;
        borrowedBooksTableBody.appendChild(row);
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
