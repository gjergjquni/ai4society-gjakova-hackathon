FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY tests ./tests
COPY README.md .

ENV PYTHONUNBUFFERED=1
ENV DATABASE_URL=sqlite:////app/data/pulsi.db

RUN mkdir -p /app/data

EXPOSE 8080

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
