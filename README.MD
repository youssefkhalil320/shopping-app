## install requirements
```bash
pip install -r requirements.txt
```

## run the app 
```bash
uvicorn app.main:app --reload
```

## add a book
```bash
curl -X POST "http://127.0.0.1:8000/books/" -H "Content-Type: application/json" -d '{"title": "The bob", "author": "eljo", "published_year": 2025}'

```

## list all the books 
```bash
curl -X GET "http://127.0.0.1:8000/books/"
```

## get a book by id
```bash
curl -X GET "http://127.0.0.1:8000/books/1"
```

## Delete a book using id 
```bash 
curl -X DELETE "http://127.0.0.1:8000/books/1"
```