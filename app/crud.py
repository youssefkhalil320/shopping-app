from .models import Book
from .database import read_db, write_db

def add_book(book: Book):
    db = read_db()
    db["books"].append(book.dict())
    write_db(db)

def get_books():
    db = read_db()
    return db["books"]

def get_book_by_id(book_id: int):
    db = read_db()
    for book in db["books"]:
        if book["id"] == book_id:
            return book
    return None

def remove_book(book_id: int):
    db = read_db()
    db["books"] = [book for book in db["books"] if book["id"] != book_id]
    write_db(db)
