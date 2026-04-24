FROM python:3.10-slim

WORKDIR /app

COPY ML/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ML/ .

EXPOSE 5000

CMD ["python", "app.py"]