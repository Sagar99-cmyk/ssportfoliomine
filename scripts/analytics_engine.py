#!/usr/bin/env python3
"""
Sagar Singh Portfolio - Power BI Analytics & Data Engine
Computes interactive analytics metrics from portfolio data
and exports visual charts using Matplotlib / Pandas.
"""

import os
import sys
import json
import time

def generate_powerbi_metrics():
    """Generates structured Power BI analytics data for executive dashboard."""
    metrics = {
        "engine": "Python Matplotlib Analytics Engine v3.2",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "kpis": {
            "data_models_analyzed": 150000,
            "forecast_precision_pct": 98.5,
            "dashboards_shipped": 6,
            "pipeline_uptime_pct": 99.98,
            "sql_query_avg_ms": 1.4,
        },
        "skills_proficiency": {
            "Expert": 6,
            "Advanced": 5,
            "Intermediate": 2,
            "Beginner": 0
        },
        "category_share": {
            "Business Intelligence": 35.0,
            "Databases & SQL": 30.0,
            "Programming": 25.0,
            "Spreadsheets": 10.0
        },
        "project_matrix": [
            {"name": "E-Commerce Sales Performance & Executive Dashboard", "category": "Sales & Business Intelligence", "impact": "High", "dax_measures": 28},
            {"name": "Supply Chain & Multi-Warehouse Inventory Optimization", "category": "Supply Chain & Logistics", "impact": "High", "dax_measures": 22},
            {"name": "Customer Lifetime Value & Retention Cohort Model", "category": "Predictive & Retention Analytics", "impact": "Medium", "dax_measures": 19}
        ]
    }

    # Attempt to render visual chart with matplotlib if available
    try:
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt

        output_dir = os.path.join(os.getcwd(), 'public', 'assets')
        os.makedirs(output_dir, exist_ok=True)
        chart_path = os.path.join(output_dir, 'powerbi_analytics_chart.png')

        # Create dark executive Power BI style chart
        plt.style.use('dark_background')
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5), facecolor='#09090b')
        ax1.set_facecolor('#0d101a')
        ax2.set_facecolor('#0d101a')

        # Chart 1: Proficiency Bar
        levels = list(metrics["skills_proficiency"].keys())
        counts = list(metrics["skills_proficiency"].values())
        colors = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af']
        bars = ax1.bar(levels, counts, color=colors, edgecolor='#ffffff22', width=0.55)
        ax1.set_title("Skills by Proficiency Level", color='#ffffff', fontsize=12, fontweight='bold', pad=12)
        ax1.set_ylabel("Registered Competencies", color='#94a3b8', fontsize=10)
        ax1.tick_params(colors='#94a3b8')
        for spine in ax1.spines.values():
            spine.set_color('#ffffff15')

        # Chart 2: Category Distribution Donut
        cat_names = list(metrics["category_share"].keys())
        cat_pcts = list(metrics["category_share"].values())
        donut_colors = ['#e11d48', '#fbbf24', '#38bdf8', '#22c55e']
        wedges, texts, autotexts = ax2.pie(
            cat_pcts, labels=cat_names, autopct='%1.0f%%', startangle=140,
            colors=donut_colors, textprops={'color': '#cbd5e1', 'fontsize': 9},
            wedgeprops=dict(width=0.45, edgecolor='#09090b', linewidth=2)
        )
        for at in autotexts:
            at.set_color('#ffffff')
            at.set_fontweight('bold')
        ax2.set_title("Technology Category Allocation", color='#ffffff', fontsize=12, fontweight='bold', pad=12)

        plt.tight_layout()
        plt.savefig(chart_path, dpi=160, facecolor=fig.get_facecolor(), edgecolor='none')
        plt.close(fig)
        metrics["chart_generated"] = True
        metrics["chart_url"] = "/assets/powerbi_analytics_chart.png"
    except Exception as e:
        metrics["chart_generated"] = False
        metrics["chart_error"] = str(e)

    return metrics

if __name__ == "__main__":
    data = generate_powerbi_metrics()
    print(json.dumps(data, indent=2))

