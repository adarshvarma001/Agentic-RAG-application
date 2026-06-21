from sqlalchemy import text
import json
from services.db_service import engine

def get_all_chats():

    with engine.connect() as conn:

        rows = conn.execute(

            text(
                """
                SELECT
                    user_id,
                    MIN(id) as first_id
                FROM chat_messages
                WHERE role='user'
                GROUP BY user_id
                ORDER BY first_id DESC
                """
            )

        ).fetchall()

        chats = []

        for row in rows:

            title = conn.execute(

                text(
                    """
                    SELECT content
                    FROM chat_messages
                    WHERE
                        user_id=:user_id
                        AND role='user'
                    ORDER BY id
                    LIMIT 1
                    """
                ),

                {
                    "user_id": row[0]
                }

            ).fetchone()

            chats.append({

                "chat_id": row[0],

                "title": title[0]

            })

    return chats

def get_all_chats():

    with engine.connect() as conn:

        rows = conn.execute(

            text(
                """
                SELECT
                    user_id,
                    MIN(id) as first_msg_id
                FROM chat_messages
                WHERE role='user'
                GROUP BY user_id
                ORDER BY first_msg_id DESC
                """
            )

        ).fetchall()

        result = []

        for row in rows:

            first_message = conn.execute(

                text(
                    """
                    SELECT content
                    FROM chat_messages
                    WHERE
                        user_id=:user_id
                        AND role='user'
                    ORDER BY id
                    LIMIT 1
                    """
                ),

                {
                    "user_id": row[0]
                }

            ).fetchone()

            result.append({

                "chat_id": row[0],

                "title": first_message[0]

            })

    return result

def save_conversation(
    user_id,
    query
):

    with engine.connect() as conn:

        last_query = conn.execute(

            text(
                """
                SELECT query
                FROM conversation_history
                WHERE user_id=:user_id
                ORDER BY id DESC
                LIMIT 1
                """
            ),

            {
                "user_id": user_id
            }

        ).fetchone()

        if (
            last_query and
            last_query[0] == query
        ):

            return

        conn.execute(

            text(
                """
                INSERT INTO conversation_history
                (
                    user_id,
                    query
                )
                VALUES
                (
                    :user_id,
                    :query
                )
                """
            ),

            {
                "user_id": user_id,
                "query": query
            }

        )

        conn.commit()
def get_memory(
    user_id,
    key
):

    with engine.connect() as conn:

        rows = conn.execute(

            text(
                """
                SELECT memory_value
                FROM user_memory
                WHERE
                    user_id=:user_id
                    AND memory_key=:memory_key
                ORDER BY id
                """
            ),

            {
                "user_id": user_id,
                "memory_key": key
            }

        ).fetchall()

        if not rows:

            return None

        return [
            row[0]
            for row in rows
        ]

def save_memory(
    user_id,
    key,
    value
):

    value = value.strip()

    if "(" in value:

        value = value.split(
            "("
        )[0].strip()

    with engine.connect() as conn:

        exists = conn.execute(

            text(
                """
                SELECT 1
                FROM user_memory
                WHERE
                    user_id=:user_id
                    AND memory_key=:memory_key
                    AND memory_value=:memory_value
                """
            ),

            {
                "user_id": user_id,
                "memory_key": key,
                "memory_value": value
            }

        ).fetchone()

        if exists:

            return

        conn.execute(

            text(
                """
                INSERT INTO user_memory
                (
                    user_id,
                    memory_key,
                    memory_value
                )
                VALUES
                (
                    :user_id,
                    :memory_key,
                    :memory_value
                )
                """
            ),

            {
                "user_id": user_id,
                "memory_key": key,
                "memory_value": value
            }

        )

        conn.commit()

def get_all_memory(
    user_id
):

    result = {}

    with engine.connect() as conn:

        rows = conn.execute(
            text(
                """
                SELECT
                    memory_key,
                    memory_value
                FROM user_memory
                WHERE user_id=:user_id
                ORDER BY id
                """
            ),
            {
                "user_id": user_id
            }
        ).fetchall()
        
        for key, value in rows:

            if key not in result:
                result[key] = []

            result[key].append(value)

        history_rows = conn.execute(
            text(
                """
                SELECT query
                FROM conversation_history
                WHERE user_id=:user_id
                ORDER BY id
                """
            ),
            {
                "user_id": user_id
            }
        ).fetchall()

        result["history"] = [
            row[0]
            for row in history_rows
        ]

    return result
def save_message(
    user_id,
    role,
    content
):
    
    if isinstance(content, dict):

        content = json.dumps(
            content,
            indent=2
        )

    with engine.connect() as conn:

        conn.execute(

            text(
                """
                INSERT INTO chat_messages
                (
                    user_id,
                    role,
                    content
                )
                VALUES
                (
                    :user_id,
                    :role,
                    :content
                )
                """
            ),

            {
                "user_id": user_id,
                "role": role,
                "content": content
            }

        )

        conn.commit()


def get_chat_history(
    user_id
):

    with engine.connect() as conn:

        rows = conn.execute(

            text(
                """
                SELECT
                    role,
                    content
                FROM chat_messages
                WHERE user_id=:user_id
                ORDER BY id
                """
            ),

            {
                "user_id": user_id
            }

        ).fetchall()

    return [

        {
            "role": row[0],
            "content": row[1]
        }

        for row in rows

    ]