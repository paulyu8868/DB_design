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

# 작가상과 도서상 구분 (award_id를 반반 나눔)
cursor.execute("SELECT award_id FROM Award")
award_ids = cursor.fetchall()
total_awards = len(award_ids)
author_awards = award_ids[:total_awards//2]
book_awards = award_ids[total_awards//2:]

# 모든 작가와 책 가져오기
cursor.execute("SELECT name FROM Author")
authors = cursor.fetchall()

cursor.execute("SELECT ISBN FROM Book")
books = cursor.fetchall()

# 작가상 매핑
for award in author_awards:
    # 각 상마다 한 명의 작가를 랜덤 선택
    selected_author = random.choice(authors)
    cursor.execute("""
        INSERT INTO Award_Author (Award_award_id, Author_name)
        VALUES (%s, %s)
    """, (award[0], selected_author[0]))

# 도서상 매핑
for award in book_awards:
    # 각 상마다 한 권의 책을 랜덤 선택
    selected_book = random.choice(books)
    cursor.execute("""
        INSERT INTO Award_Book (Award_award_id, Book_ISBN)
        VALUES (%s, %s)
    """, (award[0], selected_book[0]))
       
       
sql.commit()
sql.close()