from .database import read_db

def get_next_book_id():
    db = read_db()
    if not db["books"]:
        return 1
    return max(book["id"] for book in db["books"]) + 1
