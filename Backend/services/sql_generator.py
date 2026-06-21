from services.llm_service import llm

from prompts.sql_generation_prompt import (
    SQL_GENERATION_PROMPT
)

def generate_sql(query):

    prompt = SQL_GENERATION_PROMPT.format(
        question=query
    )

    response = llm.invoke(prompt)

    sql = response.content.strip()

    sql = sql.replace("```sql", "")
    sql = sql.replace("```", "")

    return sql