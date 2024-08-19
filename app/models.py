from pydantic import BaseModel

class Book(BaseModel):
    id: int
    title: str
    author: str
    published_year: int
    is_borrowed: bool = False
