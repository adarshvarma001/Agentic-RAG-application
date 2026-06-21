import os
import matplotlib.pyplot as plt

OUTPUT_DIR = "outputs/charts"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def generate_line_chart(df, x_col, y_col, filename):

    plt.figure(figsize=(8, 5))

    plt.plot(
        df[x_col],
        df[y_col],
        marker="o"
    )

    plt.title("Tourism Analytics")
    plt.xlabel(x_col)
    plt.ylabel(y_col)

    path = os.path.join(
        OUTPUT_DIR,
        filename
    )

    plt.savefig(path)
    plt.close()

    return path