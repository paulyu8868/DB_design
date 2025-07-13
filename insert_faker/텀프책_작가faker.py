from faker import Faker
import pymysql
import random


# DB 연결
sql = pymysql.connect( # mysql 연동
    host='localhost',
    user='root',
    port=3306,
    password='Dogok8868@',
    database='bookstore'
)


cursor = sql.cursor()

# 모든 작가와 책 가져오기
cursor.execute("SELECT name FROM Author")
authors = cursor.fetchall()

cursor.execute("SELECT ISBN FROM Book")
books = cursor.fetchall()

# 각 작가마다 20권의 책 랜덤 할당
for author in authors:
    selected_books = random.sample(books, 20)
    
    for book in selected_books:
        cursor.execute("""
            INSERT INTO Author_Book (Author_name, Book_ISBN)
            VALUES (%s, %s)
        """, (author[0], book[0]))
    
    # 1000명마다 커밋
    if authors.index(author) % 1000 == 0:
        print(f"{authors.index(author) + 1}명의 작가 처리 완료")

sql.commit()
sql.close()
