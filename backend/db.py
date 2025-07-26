# db.py
import sqlite3

DB_NAME = "ecommerce.db"

def get_connection():
    return sqlite3.connect(DB_NAME)

def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            age INTEGER,
            gender TEXT,
            state TEXT,
            street_address TEXT,
            postal_code TEXT,
            city TEXT,
            country TEXT,
            latitude REAL,
            longitude REAL,
            traffic_source TEXT,
            created_at TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            cost REAL,
            category TEXT,
            name TEXT,
            brand TEXT,
            retail_price REAL,
            department TEXT,
            sku TEXT,
            distribution_center_id INTEGER
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS distribution_centers (
            id INTEGER PRIMARY KEY,
            name TEXT,
            latitude REAL,
            longitude REAL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory_items (
            id INTEGER PRIMARY KEY,
            product_id INTEGER,
            created_at TEXT,
            sold_at TEXT,
            cost REAL,
            product_category TEXT,
            product_name TEXT,
            product_brand TEXT,
            product_retail_price REAL,
            product_department TEXT,
            product_sku TEXT,
            product_distribution_center_id INTEGER
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            order_id INTEGER PRIMARY KEY,
            user_id INTEGER,
            status TEXT,
            gender TEXT,
            created_at TEXT,
            returned_at TEXT,
            shipped_at TEXT,
            delivered_at TEXT,
            num_of_item INTEGER
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY,
            order_id INTEGER,
            user_id INTEGER,
            product_id INTEGER,
            inventory_item_id INTEGER,
            status TEXT,
            created_at TEXT,
            shipped_at TEXT,
            delivered_at TEXT,
            returned_at TEXT,
            sale_price REAL
        )
    ''')

    # Conversation schema for storing chat histories
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations (id)
        )
    ''')

    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_conversations_user_session ON conversations(user_id, session_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)')

    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_tables()
    print("All tables created successfully.")
