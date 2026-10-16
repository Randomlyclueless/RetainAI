# RetainAI — Customer Churn Prediction & Retention Platform

RetainAI is a full-stack customer churn analysis platform that combines a machine-learning prediction service, a Spring Boot backend, a MySQL database, and a React dashboard. It also includes a Gemini-powered AI assistant for asking questions about available churn results and retention strategies.

## Features

- **Customer management:** Add and view customer records.
- **Churn prediction:** Send customer features to the ML service and store the resulting prediction, churn probability, and risk level.
- **Dashboard analytics:** View customer totals and churn/retention statistics.
- **Reports:** Review churn insights and customer risk information, with report/export functionality implemented in the frontend.
- **AI assistant:** Ask questions about available customer churn data and get explanations or practical retention suggestions from Google Gemini.
- **CSV import:** Import customer records through the backend's CSV upload functionality.
- **Containerized setup:** Run the frontend, backend, ML service, and MySQL using Docker Compose.

## Architecture

```text
React frontend (port 3000)
        |
        | HTTP requests
        v
Spring Boot backend (port 8080) ------> MySQL (host port 3307)
        |
        +------------------------------> FastAPI ML service (internal port 8001)
        |
        +------------------------------> Google Gemini API
```

The ML service makes churn predictions. Gemini is used as an assistant to explain available data and suggest retention actions; it does not replace the churn prediction model.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, CSS |
| Backend | Java 17, Spring Boot 3.5.13, Spring Web, Spring Data JPA |
| Database | MySQL 8 |
| ML service | Python 3.11, FastAPI, scikit-learn/XGBoost model pipeline |
| AI assistant | Google Gemini API |
| Containers | Docker, Docker Compose |

## Project Structure

```text
RetainAI/
├── Frontend/
│   └── my-app/                 # React application
├── backend/
│   └── backend/                # Spring Boot REST API
├── ml-service/                 # FastAPI prediction service and model
├── docker-compose.yaml         # Local multi-service setup
├── .env                        # Local secrets/configuration (do not commit)
└── README.md
```

## Prerequisites

Install the following before running RetainAI:

- Docker Desktop with Docker Compose
- A Google Gemini API key for the AI assistant

The backend and ML service are built into containers by Docker Compose, so you do not need to install Java or Python separately to run the full stack locally.

## Setup and Run

### 1. Clone the repository

```bash
git clone https://github.com/Randomlyclueless/RetainAI.git
cd RetainAI
```

If the project branch you need is `merged`, check it out:

```bash
git checkout merged
```

### 2. Configure environment variables

Create a `.env` file in the repository root, alongside `docker-compose.yaml`:

```dotenv
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Replace the placeholder with your own key from Google AI Studio. Do not commit `.env` or expose the API key in frontend code, screenshots, logs, or public repositories. If the configured Gemini model is unavailable for your account, use a model name supported by your Gemini API access.

The Compose configuration passes these values to the backend container.

### 3. Start the application

From the repository root:

```bash
docker compose -f docker-compose.yaml up -d --build
```

Check the services:

```bash
docker compose -f docker-compose.yaml ps
```

View backend logs:

```bash
docker logs --tail 100 retainai-backend
```

### 4. Open RetainAI

- Frontend: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Reports: http://localhost:3000/report
- Customer API: http://localhost:8080/customers
- Customer statistics API: http://localhost:8080/customers/stats
- Chat API: `POST http://localhost:8080/api/chat`
- MySQL host port: `3307`

The ML service is configured for internal Docker communication at port `8001`; it is not published as a host port in the current Compose configuration.

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/customers` | Retrieve customer records |
| `POST` | `/customers` | Predict churn for a submitted customer and save the result |
| `GET` | `/customers/stats` | Retrieve customer and churn/retention statistics |
| `POST` | `/api/chat` | Send a message to the Gemini-powered assistant |

### Chat request example

```json
{
  "message": "Give me a brief overview of the customer churn data in RetainAI."
}
```

Successful responses contain a `response` field. Errors may contain an `error` field.

Example PowerShell request:

```powershell
$body = @{
    message = "Give me a brief overview of the customer churn data in RetainAI."
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:8080/api/chat" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

## Customer Prediction Inputs

The backend sends these fields to the ML service when a customer is created:

- `tenure`
- `monthlyCharges`
- `totalCharges`
- `contract`
- `internetService`
- `paymentMethod`

The ML service returns the prediction, churn probability, and risk level. The backend stores those outputs with the customer record.

For the exact categorical encoding expected by the current model, refer to the ML service's preprocessing/training code. Ensure values submitted through the UI match those encodings.

## Useful Docker Commands

Rebuild and start all services:

```bash
docker compose -f docker-compose.yaml up -d --build
```

Rebuild only the backend:

```bash
docker compose -f docker-compose.yaml up -d --build backend
```

Rebuild only the frontend:

```bash
docker compose -f docker-compose.yaml up -d --build frontend
```

View logs:

```bash
docker compose -f docker-compose.yaml logs -f backend
docker compose -f docker-compose.yaml logs -f frontend
docker compose -f docker-compose.yaml logs -f ml-service
```

Stop the services without deleting the database volume:

```bash
docker compose -f docker-compose.yaml down
```

Avoid `docker compose down -v` unless you intentionally want to delete the persistent MySQL volume and its stored data.

## Security Notes

- Keep `.env` out of Git. Verify with `git check-ignore .env`.
- Never place the Gemini API key in React code.
- Rotate the Gemini key if it has been exposed.
- The current frontend API URLs use `localhost`; configure appropriate API URLs and environment variables before deploying to a remote environment.
- The chatbot's responses are AI-generated and can be inaccurate. Verify important business decisions against source data and model outputs.
- Only send customer information to external AI services when authorized. Avoid sending personal data that is not necessary for the question.

## Current Limitations

- Local development URLs are configured for `localhost`.
- The AI assistant depends on a valid Gemini API key, network access, and available API quota.
- The assistant summarizes the customer data provided by the backend; it should not be treated as a replacement for the underlying prediction model or as a guarantee that a customer will churn.
- The local demo authentication/UI should not be treated as production-grade authentication unless a separate secure authentication implementation is configured.

## Future Improvements

- Add production authentication and role-based access control.
- Move frontend API URLs into environment-based configuration.
- Add automated tests for the chatbot endpoint and customer workflows.
- Add monitoring for model performance and API failures.
- Deploy the services with managed secrets and HTTPS.

## License

No license is specified here. Add a license file if you intend to define how others may use, modify, or distribute this project.
