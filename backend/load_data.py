# load_data.py
import csv
import os
import sqlite3
from db import get_connection

DATA_DIR = "data"

def clear_table(table_name):
    """Clear existing data from a table"""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f"DELETE FROM {table_name}")
        conn.commit()
        print(f"Cleared existing data from {table_name}")
    except Exception as e:
        print(f"Warning: Could not clear {table_name}: {e}")
    finally:
        conn.close()

def load_csv(file_name, table_name, columns, clear_existing=True):
    """Load CSV data into database table"""
    conn = get_connection()
    cursor = conn.cursor()
    path = os.path.join(DATA_DIR, file_name)
    
    if not os.path.exists(path):
        print(f"Error: File {path} not found")
        conn.close()
        return

    if clear_existing:
        clear_table(table_name)

    try:
        with open(path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            count = 0
            
            for row in reader:
                try:
                    # Handle missing columns gracefully
                    values = []
                    for col in columns:
                        value = row.get(col, None)
                        # Convert empty strings to None
                        if value == '':
                            value = None
                        values.append(value)
                    
                    placeholders = ', '.join('?' * len(columns))
                    cursor.execute(f'''
                        INSERT INTO {table_name} ({', '.join(columns)})
                        VALUES ({placeholders})
                    ''', values)
                    count += 1
                    
                    # Commit every 1000 rows to avoid memory issues
                    if count % 1000 == 0:
                        conn.commit()
                        print(f"  Processed {count} rows...")
                        
                except sqlite3.Error as e:
                    print(f"Error inserting row {count + 1}: {e}")
                    print(f"Row data: {row}")
                    continue

        conn.commit()
        conn.close()
        print(f" Successfully loaded {count} rows into {table_name} from {file_name}")
        
    except Exception as e:
        print(f" Error loading {file_name}: {e}")
        conn.close()

def main():
    print(" Starting data loading process...")
    print("=" * 50)
    
    # Load data in order of dependencies
    load_csv("distribution_centers.csv", "distribution_centers", [
        "id", "name", "latitude", "longitude"
    ])
    
    load_csv("users.csv", "users", [
        "id", "first_name", "last_name", "email", "age", "gender", "state", "street_address",
        "postal_code", "city", "country", "latitude", "longitude", "traffic_source", "created_at"
    ])

    load_csv("products.csv", "products", [
        "id", "cost", "category", "name", "brand", "retail_price",
        "department", "sku", "distribution_center_id"
    ])

    load_csv("inventory_items.csv", "inventory_items", [
        "id", "product_id", "created_at", "sold_at", "cost",
        "product_category", "product_name", "product_brand", "product_retail_price",
        "product_department", "product_sku", "product_distribution_center_id"
    ])

    load_csv("orders.csv", "orders", [
        "order_id", "user_id", "status", "gender", "created_at", "returned_at",
        "shipped_at", "delivered_at", "num_of_item"
    ])

    load_csv("order_items.csv", "order_items", [
        "id", "order_id", "user_id", "product_id", "inventory_item_id", "status",
        "created_at", "shipped_at", "delivered_at", "returned_at", "sale_price"
    ])
    
    print("=" * 50)
    print("🏁 Data loading completed!")

if __name__ == "__main__":
    main()
