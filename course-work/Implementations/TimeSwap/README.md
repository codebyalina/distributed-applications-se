# TimeSwap

## Описание

**TimeSwap** е peer-to-peer платформа за размяна на задачи, време и услуги между потребители (нещо като "бартер за умения и дейности").  
Потребителите могат да създават задачи, да ги харесват, да се кандидатират за изпълнение, а създателят избира кой ще я изпълни (match). След завършване на задачата, наградата (пари/точки) се трансферира автоматично между портфейлите на двамата.

---

## Основни Функционалности

- **Регистрация и логин** с JWT токени  
- **Създаване, редакция, изтриване** на задачи  
- **Харесване и кандидатстване** по задачи  
- **Match** – създателят възлага задача на изпълнител  
- **Завършване** на задача с автоматично разплащане  
- **Потребителски профил** – репутация, портфейл, аватар  
- **Модерен UI** – анимирани съобщения, тъмна тема, responsive дизайн  
- **Търсене, филтриране, сортиране** на задачите  
- **Валидирани входни данни** на всички нива  
- **Unit тестове** (pytest)  
- **REST API** (Flask)

---

## Технологии

- **Backend:** Python, Flask, SQLAlchemy, Flask-JWT-Extended, SQLite/MySQL/MS SQL
- **Frontend:** React, Vite, TypeScript, Axios, Custom CSS (dark neumorphism)
- **Unit Tests:** Pytest

---

## Схема на базата (основни таблици)

- **User** – username, email, password_hash, reputation, role, wallet, avatar_url
- **Task** – title, description, deadline, reward, status, created_by, claimed_by
- **Like, Match** – връзки между user и task

---

## Инсталация и стартиране

### 1. Клониране на репото

```bash
git clone https://github.com/[YOUR_USERNAME]/TimeSwap.git
cd TimeSwap
```

### 2. Настройка на Back-end (Flask API)

#### a) Създай виртуално Python среда (по желание)

```bash
python -m venv venv
source venv/bin/activate  # (или venv\Scripts\activate за Windows)
```

#### b) Инсталирай зависимостите

```bash
pip install -r requirements.txt
```

#### c) Създай `.env` файл с необходимите променливи:

```ini
SECRET_KEY=supersecret
JWT_SECRET_KEY=ultrasecret
DATABASE_URL=sqlite:///timeswap.db
FRONTEND_ORIGIN=http://localhost:5173
```

*(Ако ползваш друга база, промени DATABASE_URL)*

#### d) Инициализирай базата (автоматично при първи run):

```bash
python app.py
```
- Flask ще създаде таблиците.
- Default: слуша на `http://localhost:5000`

#### e) (По желание) Пусни Unit тестовете:

```bash
pytest test_app.py
```

---

### 3. Настройка на Front-end (React + Vite)

#### a) Влез в `client/` папката:

```bash
cd client
```

#### b) Инсталирай зависимостите:

```bash
npm install
```

#### c) Стартирай development server:

```bash
npm run dev
```
- Клиентът ще слуша на `http://localhost:5173`

---

## Примерен .env файл (за Flask)

```ini
SECRET_KEY=supersecret
JWT_SECRET_KEY=ultrasecret
DATABASE_URL=sqlite:///timeswap.db
FRONTEND_ORIGIN=http://localhost:5173
```

---

## Стартиране на целия проект

1. Стартирай Flask бекенда:
    ```
    python app.py
    ```
2. Стартирай React фронтенда:
    ```
    cd client
    npm run dev
    ```
3. Влез на [http://localhost:5173](http://localhost:5173)

---

## Тестване

- **Unit tests:**  
  В основната папка (където е app.py):
    ```
    pytest test_app.py
    ```
- Покрива регистрация, логин, CRUD задачи, claim/complete, права на достъп, търсене.

---

## Credits

- Автор: Алина Никита
- Факултетен номер: 2301321087
- Проект за курса: Разпределени Приложения
- Преподавател: Виктор Матански
- Година: 2025

---

## Примерни Screenshots

<img src="https://github.com/user-attachments/assets/d13a345c-0c45-4782-b7b6-915dfd09ce26" width="50%">

---

<img src="https://github.com/user-attachments/assets/a7188729-30b6-4ec5-bdb9-522861488aba" width="50%">

---

<img src="https://github.com/user-attachments/assets/e3d928d6-1ca3-4be5-8a11-f046e095859a" width="50%">

---

## Допълнителни точки (екстри)

- Качване на аватар (upload)
- Централизирани анимирани съобщения (toast)
- Интуитивен, модерен интерфейс с плавни анимации
- Unit тестове за всички основни функции

*TimeSwap – Платформа за размяна на време и умения.  
Покажи колко струва твоят час!*
