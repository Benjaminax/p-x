FROM python:3.9-slim

WORKDIR /app

# Install build tools required by some Python wheels.
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .
COPY model.py .
COPY utils.py .

EXPOSE 5000

CMD ["python", "server.py"]
