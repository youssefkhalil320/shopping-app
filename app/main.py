from fastapi import FastAPI, HTTPException
from .schemas import BookCreate, BookOut, BookBorrow
from .models import Book
from .crud import add_book, get_books, get_book_by_id, remove_book
from .utils import get_next_book_id

app = FastAPI()

@app.post("/books/", response_model=BookOut)
def create_book(book: BookCreate):
    book_id = get_next_book_id()
    new_book = Book(id=book_id, **book.dict())
    add_book(new_book)
    return new_book

@app.get("/books/", response_model=list[BookOut])
def list_books():
    return get_books()

@app.get("/books/{book_id}", response_model=BookOut)
def read_book(book_id: int):
    book = get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    book = get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    remove_book(book_id)
    return {"message": "Book deleted successfully"}

@app.post("/books/borrow")
def borrow_book(borrow: BookBorrow):
    book = get_book_by_id(borrow.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book["is_borrowed"]:
        raise HTTPException(status_code=400, detail="Book already borrowed")
    
    book["is_borrowed"] = True
    db = read_db()
    db["borrowed_books"].append({"book_id": borrow.book_id, "user": borrow.user})
    write_db(db)
    return {"message": "Book borrowed successfully"}
