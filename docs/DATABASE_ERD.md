# Model bazy danych — ERD

## Diagram

```mermaid
erDiagram
    USERS ||--o{ LOANS : "otrzymuje"
    USERS ||--o{ LOANS : "wydaje"
    RESOURCES ||--o{ LOANS : "historia"

    USERS {
        int id PK
        varchar name
        varchar email UK
        varchar password_hash
        enum role
        boolean is_active
        timestamp created_at
    }

    RESOURCES {
        int id PK
        varchar name
        varchar serial_number UK
        varchar category
        enum condition_status
        varchar location
        enum status
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    LOANS {
        int id PK
        int resource_id FK
        int user_id FK
        int issued_by FK
        timestamp checkout_date
        date due_date
        datetime return_date
    }
```

## Opis
- Jeden użytkownik może mieć wiele wypożyczeń; wypożyczenie wskazuje jednego użytkownika przez user_id.
- Administrator wydający zasób jest zapisany przez issued_by.
- Zasób może mieć wiele wpisów historii w różnym czasie, ale tylko jedno aktywne wypożyczenie naraz.
- return_date = NULL oznacza wypożyczenie aktywne.
- Usunięcie w aplikacji oznacza archiwizację przez is_active = 0, aby zachować historię.

Nazwy tabel i pól odpowiadają database/schema.sql.