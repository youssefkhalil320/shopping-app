from pydantic import BaseModel
from typing import Optional

class BookCreate(BaseModel):
    title: str
    author: str
    published_year: int

class BookOut(BookCreate):
    id: int
    is_borrowed: bool

class BookBorrow(BaseModel):
    book_id: int
    user: str
