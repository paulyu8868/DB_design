# BookStore - 온라인 서점 관리 시스템

## 📚프로젝트 소개

BookStore는 도서 예약 및 구매 기능을 제공하는 웹 기반 서점 관리 시스템입니다. 관리자와 고객 권한을 구분하여 각각 다른 기능을 제공합니다.

### 주요 기능

**고객 기능**
<img width="964" height="189" alt="image" src="https://github.com/user-attachments/assets/48162905-3556-4e1b-8198-24b65d98c326" />

- 도서명, 작가명, 수상명으로 도서 검색
- 도서 예약 관리 (생성, 수정, 취소)
- 장바구니 기능 및 도서 구매
- 주문 내역 조회

**관리자 기능**
<img width="964" height="292" alt="image" src="https://github.com/user-attachments/assets/37c193a0-e6b6-4201-b6e2-c5a47ca93fd8" />

- Book, Author, Award, Warehouse, Inventory 데이터 CRUD
- 재고 관리
- 주문 관리
- 동시 수정 방지 (Lock 메커니즘)


## 📜ERD
<img width="945" height="412" alt="image" src="https://github.com/user-attachments/assets/7a8e684b-6bc3-4cf2-adc7-00c5295d8921" />


### 주요 테이블
1. **Book** - 도서 정보 (ISBN, 제목, 가격, 카테고리, 출판년도)
2. **Author** - 작가 정보 (이름, 주소, URL)
3. **Customer** - 고객 정보 (이메일, 이름, 연락처, 주소, 권한)
4. **Warehouse** - 창고 정보
5. **Reservation** - 예약 정보
6. **ShoppingBasket** - 장바구니
7. **Award** - 수상 정보

### 관계 테이블
- **Author_Book** - 작가와 도서 N:M 관계
- **Award_Author** - 수상과 작가 N:M 관계
- **Award_Book** - 수상과 도서 N:M 관계
- **Book_Warehouse** - 도서 재고 관리
- **Book_ShoppingBasket** - 장바구니 내 도서

### 정규화
- 모든 테이블은 BCNF까지 정규화 완료
- 원자성, 함수 종속성 준수
- 이상 현상(Anomaly) 방지

## 데이터셋

- 작가: 10,000명
- 도서: 200,000권
- 수상: 220개 (20개 x 11년)
- 창고: 10개
- 고객: 10명 (관리자 2명, 일반 고객 8명)

## 성능 최적화

### 인덱스 적용
검색 성능 향상을 위해 다음 인덱스 적용:

1. **도서명 검색**: idx_book_title (HASH)
   - 성능 개선: 0.7초 → 0.02초

2. **수상명 검색**: idx_award_name (HASH)
   - 성능 개선: 0.2초 → 0.01초

exact match 검색에 최적화된 HASH 인덱스 사용
=> 다만 좀 더 명확한 성능개선을 체험하려면 더 많은 더미데이터로 실험하길 권장

### 기술 스택

### Backend

- Node.js
- Express.js
- MySQL
- Python (더미 데이터 생성)

### Frontend

- HTML/CSS/JavaScript
- Handlebars (템플릿 엔진)
- Tailwind CSS
