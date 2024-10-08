from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from .schemas import BookCreate, BookOut, BookBorrow
from .models import Book, BookReturn, BookBorrow
from .database import read_db, write_db
from .crud import add_book, get_books, get_book_by_id, remove_book
from .utils import get_next_book_id
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request

app = FastAPI()

# In-memory storage for sessions (for demonstration purposes)
sessions = {}
# Define roles and users (for demonstration purposes)
users = {
    "admin": {"password": "adminpass", "role": "admin"},
    "user": {"password": "userpass", "role": "user"},
}

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

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
    db = read_db()
    
    # Find the book by ID
    book = next((b for b in db["books"] if b["id"] == borrow.book_id), None)
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book["is_borrowed"]:
        raise HTTPException(status_code=400, detail="Book already borrowed")
    
    # Update the book's status to borrowed
    book["is_borrowed"] = True
    
    # Record the borrowed book in the borrowed_books list
    db["borrowed_books"].append({"book_id": borrow.book_id, "user": borrow.user})
    
    # Save the updated database
    write_db(db)
    
    return {"message": "Book borrowed successfully"}

@app.get("/book/borrowed")
def get_borrowed_books():
    db = read_db()
    borrowed_books = db.get("borrowed_books", [])
    
    borrowed_books_info = []
    for record in borrowed_books:
        book_id = int(record["book_id"])
        user = record["user"]
        
        # Find the book details
        book = next((b for b in db["books"] if b["id"] == book_id), None)
        if book:
            borrowed_books_info.append({
                "id": book_id,
                "title": book["title"],
                "author": book["author"],
                "published_year": book["published_year"],
                "user": user
            })

    return {"borrowed_books": borrowed_books_info}

@app.post("/books/return")
def return_book(return_info: BookReturn):
    db = read_db()
    
    # Find the book by ID
    book = next((b for b in db["books"] if b["id"] == return_info.book_id), None)
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if not book["is_borrowed"]:
        raise HTTPException(status_code=400, detail="Book was not borrowed")
    
    # Update the book's status to not borrowed
    book["is_borrowed"] = False
    
    # Remove the book from the borrowed_books list
    db["borrowed_books"] = [record for record in db["borrowed_books"] if record["book_id"] != return_info.book_id]
    
    # Save the updated database
    write_db(db)
    
    return {"message": "Book returned successfully"}


@app.delete("/delete_books/{book_id}")
def delete_book(book_id: int):
    db = read_db()
    
    # Find the book by ID
    book = next((b for b in db["books"] if b["id"] == book_id), None)
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Remove the book from the books list
    db["books"] = [b for b in db["books"] if b["id"] != book_id]
    
    # Also remove the book from the borrowed_books list if it was borrowed
    db["borrowed_books"] = [record for record in db["borrowed_books"] if record["book_id"] != book_id]
    
    # Save the updated database
    write_db(db)
    
    return {"message": "Book deleted successfully"}
