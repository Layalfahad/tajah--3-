import sqlite3
import json
import sys

# Reconfigure stdout to support UTF-8 printing of Arabic characters
sys.stdout.reconfigure(encoding='utf-8')

db_path = 'server/tajah.db'
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row['name'] for row in cursor.fetchall()]

print("--- Inspecting references for User ID 15 ---")
for table in tables:
    cursor.execute(f"PRAGMA table_info({table});")
    columns = [col['name'] for col in cursor.fetchall()]
    
    conditions = []
    if 'user_id' in columns:
        conditions.append("user_id = 15")
    if 'player_id' in columns:
        conditions.append("player_id = 15")
    if 'club_id' in columns:
        conditions.append("club_id = 15")
    if table == 'users' and 'id' in columns:
        conditions.append("id = 15")
        
    if conditions:
        where_clause = " OR ".join(conditions)
        query = f"SELECT COUNT(*) as count FROM {table} WHERE {where_clause}"
        cursor.execute(query)
        cnt = cursor.fetchone()['count']
        if cnt > 0:
            print(f"Table '{table}': {cnt} matching rows found.")
            cursor.execute(f"SELECT * FROM {table} WHERE {where_clause}")
            rows = [dict(r) for r in cursor.fetchall()]
            for r in rows:
                print(f"  Row: {r}")

print("\n--- Deleting User ID 15 and all associated references ---")
for table in tables:
    cursor.execute(f"PRAGMA table_info({table});")
    columns = [col['name'] for col in cursor.fetchall()]
    
    conditions = []
    if 'user_id' in columns:
        conditions.append("user_id = 15")
    if 'player_id' in columns:
        conditions.append("player_id = 15")
    if 'club_id' in columns:
        conditions.append("club_id = 15")
    if table == 'users' and 'id' in columns:
        conditions.append("id = 15")
        
    if conditions:
        where_clause = " OR ".join(conditions)
        delete_query = f"DELETE FROM {table} WHERE {where_clause}"
        cursor.execute(delete_query)
        print(f"Executed on table '{table}': {cursor.rowcount} rows deleted.")

conn.commit()
conn.close()
print("Deletion complete and committed.")
