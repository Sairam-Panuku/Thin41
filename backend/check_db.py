import sqlite3

def check_database():
    conn = sqlite3.connect('ecommerce.db')
    cursor = conn.cursor()
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print("Tables in database:")
    for table in tables:
        print(f"  - {table[0]}")
    
    # Check if conversations table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='conversations'")
    if cursor.fetchone():
        print("\nConversations table exists!")
        
        # Check conversation count
        cursor.execute("SELECT COUNT(*) FROM conversations")
        count = cursor.fetchone()[0]
        print(f"Number of conversations: {count}")
        
        # Check messages count
        cursor.execute("SELECT COUNT(*) FROM messages")
        count = cursor.fetchone()[0]
        print(f"Number of messages: {count}")
    else:
        print("\nConversations table does not exist!")
    
    conn.close()

if __name__ == "__main__":
    check_database() 