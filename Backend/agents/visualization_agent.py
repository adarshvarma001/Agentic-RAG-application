from services.chart_service import (
    generate_line_chart
)

from services.llm_service import llm

from prompts.chart_summary_prompt import (
    CHART_SUMMARY_PROMPT
)

def visualization_agent(
    question,
    dataframe
):

    chart_path = generate_line_chart(
        dataframe,
        x_col="year",
        y_col="total_visitors",
        filename="visitor_trend.png"
    )

    prompt = CHART_SUMMARY_PROMPT.format(
        question=question,
        data=dataframe.to_string(index=False)
    )

    response = llm.invoke(prompt)

    return {
        "summary": response.content,
        "chart": chart_path
    }