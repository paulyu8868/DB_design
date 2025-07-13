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


# 모든 책과 창고 가져오기
cursor.execute("SELECT ISBN FROM Book")
all_books = cursor.fetchall()

cursor.execute("SELECT code FROM Warehouse")
warehouses = cursor.fetchall()

# 책을 20000개씩 분할
books_per_warehouse = 20000
book_chunks = [all_books[i:i + books_per_warehouse] for i in range(0, len(all_books), books_per_warehouse)]

# 각 창고마다 할당된 책들 입력
for i, warehouse in enumerate(warehouses):
    if i < len(book_chunks):  # 할당할 책이 남아있는 경우
        for book in book_chunks[i]:
            cursor.execute("""
                INSERT INTO Book_Warehouse (Book_ISBN, Warehouse_code, quantity)
                VALUES (%s, %s, %s)
            """, (book[0], warehouse[0], 10))

sql.commit()
sql.close()