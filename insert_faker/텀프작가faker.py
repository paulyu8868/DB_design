from faker import Faker
import pymysql

# 생성 작가 수
authors=[]

# DB 연결
sql = pymysql.connect( # mysql 연동
    host='localhost',
    user='root',
    port=3306,
    password='Dogok8868@',
    database='bookstore'
)
cursor = sql.cursor()

# Faker 설정 (한국어 - 60%, 영어 - 30%, 일본어 - 10%)
fake_kr = Faker('ko_KR')
fake_en = Faker('en_US')
fake_jp = Faker('ja_JP')


while len(authors)<9999: # 작가 9999명 생성
    # 랜덤 확률로 국가별 작가 생성
    rand = fake_kr.random.random()
    
    if rand < 0.6:  # 한국 작가
        name = fake_kr.name()
        address = fake_kr.address()
        url = f"http://www.{fake_kr.domain_name()}/author/{fake_kr.user_name()}"
    elif rand < 0.9:  # 영미권 작가
        name = fake_en.name()
        address = fake_en.address()
        url = f"http://www.{fake_en.domain_name()}/author/{fake_en.user_name()}"
    else:  # 일본 작가
        name = fake_jp.name()
        address = fake_jp.address()
        url = f"http://www.{fake_jp.domain_name()}/author/{fake_jp.user_name()}"
    
    # 이름 중복 방지
    if name not in authors: # 이름 중복 안될때만 insert
        authors.append(name) # 작가 이름 등록
    
        # DB에 삽입
        cursor.execute("""
            INSERT INTO Author (name, address, url)
            VALUES (%s, %s, %s)
        """, (name, address, url))
    

sql.commit()
sql.close()
