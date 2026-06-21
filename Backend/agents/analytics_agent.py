from tools.sql_tool import execute_sql
from tools.sql_validator import (
    validate_sql,
    is_visualization_query
)

from services.sql_generator import generate_sql
from services.llm_service import llm

from prompts.sql_summary_prompt import (
    SQL_SUMMARY_PROMPT
)


def analytics_agent(query):

    sql = generate_sql(query)

    validate_sql(sql)

    df = execute_sql(sql)

    if is_visualization_query(query):

        return {
            "type": "visualization",
            "data": df.to_dict(orient="records")
        }

    prompt = SQL_SUMMARY_PROMPT.format(
        question=query,
        result=df.to_string(index=False)
    )

    response = llm.invoke(prompt)

    return {
        "type": "summary",
        "answer": response.content
    }