# RetainAI — Design Specification (Antigravity Import)

## 1. Aesthetic: Dark OLED Luxury + Glassmorphism
- **Background**: #000000 (True Black), #0A0A0A (Near Black), #111111 (Inner Surfaces)
- **Accent**: #D4AF37 (Luxury Gold)
- **Status Colors**:
    - **Success (Low Risk)**: #00FF94 (Emerald Green)
    - **Warning (Medium Risk)**: #FFB800 (Amber)
    - **Danger (High Risk)**: #FF4444 (Vivid Red)
- **Glass Panels**: 
    - Fill: `rgba(255, 255, 255, 0.05)`
    - Blur: `12px`
    - Border: `1px rgba(255, 255, 255, 0.1)` (Gold glow on hover)
- **Typography**:
    - Hero Headlines: **DM Serif Display** (Serif, High Contrast)
    - UI Elements: **Inter** (Sans Serif, Medium Weight)

---

## 2. Pages

### Page A: Landing Page
- **Hero Section**: 
    - Background: OLED Black.
    - Headline: "Predict churn before it costs you." (DM Serif Display, 72px)
    - Subheadline: "Retention-as-a-Service powered by production-grade MLOps." (Inter, 20px, light gray)
    - CTA: Gold Button "Open Dashboard" (Pill-shaped, #000 text)
    - Right Visual: A floating glass card showing a sample customer profile (e.g. "Customer ID: 19324") with a radial dial showing 78% risk. Small SHAP bars beneath (e.g., "tenure: -12%", "last_login: +8%").
- **Stats Bar**: 4 Glass Panels in a single row.
    - Card 1: "96.4%" (Label: Model Accuracy)
    - Card 2: "+6.8%" (Label: AUC Gain vs Baseline)
    - Card 3: "30-Day" (Label: Prediction Horizon)
    - Card 4: "3" (Label: Automated Channels)
- **How It Works**: 3-column row with Glass Cards.
    - Card 1: Gold "1" Icon. "Ingest Signals" – Stream events via API or direct Snowflake sync.
    - Card 2: Gold "2" Icon. "Score Risk" – Real-time inference through trained XGBoost ensembles.
    - Card 3: Gold "3" Icon. "Trigger Action" – Automated webhooks to Slack, Zendesk, or email.
- **Model Comparison Table**:
    - Dark Glass Table. Columns: Algorithm, AUC, Precision, Recall, F1.
    - Row 1: XGBoost | 0.88 | 0.76 | 0.71 | 0.73
    - Row 2: LightGBM | 0.86 | 0.74 | 0.69 | 0.71
    - Row 3: CatBoost | 0.87 | 0.75 | 0.70 | 0.72
    - **Row 4 (Highlighted Gold)**: Ensemble | 0.92 | 0.84 | 0.81 | 0.82
- **Tech Stack**: Monochromatic logo row featuring MLflow, XGBoost, FastAPI, Prefect, and Evidently AI.

### Page B: Dashboard Page
- **Navigation**: Top bar, Glass blur. RetainAI Logo in Gold. Nav: Overview, Models, Data, Settings. Production v2 badge in gold pill.
- **KPI Row**: 4 Panels.
    - Panel 1: "12,482" (Total Monitored)
    - Panel 2: "842" (High Risk, Red Indicator)
    - Panel 3: "248" (Retained this week, Green Indicator)
    - Panel 4: "0.92" (Model AUC, Gold Indicator)
- **Central Intelligence**:
    - **Risk Donut (60%)**: Left side. Donut chart showing breakdown of High/Med/Low risk segments. Adjacent is "At-Risk Customers" table.
        - Cols: ID, Score, Root Cause, Action.
        - Rows: 1024 (92%, Low Engagement, Slack Alert), 3041 (88%, Support Tickets, Email Sent).
    - **SHAP Bar Chart (40%)**: Right side. Horizontal Gold bars showing global feature importance (e.g., Tenure, Monthly Charges, Support Tickets).
- **Temporal Analysis**:
    - **Churn Timeline**: Line chart showing churn probability across the last 30 days. Gold line on Black grid.
    - **Campaign Effectiveness**: Bar chart comparing "Outreach Sent" vs "Successfully Retained" across different customer segments.
- **Lower Console**:
    - **Drift Detector**: "No Data Drift Detected" (Success Green) or "Drift Alert: Data Schema Shift" (Danger Red).
    - **Model Health**: Sparkline showing AUC trend. Last Retrain timestamp.
    - **Root Cause Breakdown**: Small pie chart showing top 3 indicators (Usage Drop, Price Hike, Support Volume).

---

## 3. Implementation Rules
- NO gradients in UI chrome; depth comes from glass layering.
- NO blue. NO rainbow colors.
- ALL charts use #D4AF37 (Primary), #00FF94 (Success), #FF4444 (Error).
- EVERY surface must have `backdrop-filter: blur(12px)`.
- TABLES must have alternating row transparency (`rgba(255,255,255,0.02)` and `rgba(255,255,255,0.05)`).
