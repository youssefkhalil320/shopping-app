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
