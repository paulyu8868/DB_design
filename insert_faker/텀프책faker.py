from faker import Faker
import pymysql
import random

def generate_book_title(fake):
   # 제목 패턴
   patterns = [
       f"{fake.word()} {fake.word()}",  # 두 단어 조합
       f"{fake.word()}의 {fake.word()}",  # '~의 ~' 형식
       f"{fake.word()}에 관하여",  # '~에 관하여' 형식
       f"{fake.word()} {fake.word()} {fake.word()}",  # 세 단어 조합
   ]
   
   # 부제 추가 패턴
   subtitles = [
       f": {fake.word()}의 이야기",
       f": {fake.word()} {fake.word()}의 세계",
       f" - {fake.word()}를 찾아서"
   ]
   
   title = random.choice(patterns)
   # 30% 확률로 부제 추가
   if random.random() < 0.3:
       title += random.choice(subtitles)
       
   return title

# DB 연결
sql = pymysql.connect( # mysql 연동
    host='localhost',
    user='root',
    port=3306,
    password='Dogok8868@',
    database='bookstore'
)
cursor = sql.cursor()
books = [] # 책의 isbn 저장

# Faker 설정 (한국어, 영어, 일본어)
fake_kr = Faker('ko_KR')
fake_en = Faker('en_US')
fake_jp = Faker('ja_JP')

# 카테고리 설정
categories = ['소설', '시', '에세이', '인문', '과학', '경제', '자기계발', '역사', 
            '예술', '종교', '철학', '심리', '정치', '사회', '여행']


while len(books)<199999: # 총 19만 9999권 생성
    # 랜덤 확률로 국가별 도서 생성
    rand = random.random()
    
    if rand < 0.6:  # 한국 도서 (60%)
        title = generate_book_title(fake_kr)
    elif rand < 0.9:  # 영미권 도서 (30%)
        title = generate_book_title(fake_en)
    else:  # 일본 도서 (10%)
        title = generate_book_title(fake_jp)
    
    # ISBN 생성 (978 + 10자리 랜덤 숫자)
    isbn = f"978{str(random.randint(0, 9999999999)).zfill(10)}"
    
    # 가격 설정 (8000원 ~ 35000원, 1000원 단위)
    price = random.randrange(8000, 35000, 1000)
    
    # 출판년도 (2013-2023)
    year = random.randint(2013, 2023)
    
    # 카테고리
    category = random.choice(categories)
    
    if isbn not in books:
        books.append(isbn) # 중복되는 isbn이 없도록 관리
        # DB에 삽입
        cursor.execute("""
            INSERT INTO Book (ISBN, category, price, title, year)
            VALUES (%s, %s, %s, %s, %s)
        """, (isbn, category, price, title, year))
    
    if len(books)>1000 and len(books)%1000==0:
        print(f'{len(books)}권 완료')
    

sql.commit()
print(f"도서 {len(books)}권 생성 완료")
sql.close()
