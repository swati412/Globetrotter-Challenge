FROM python:3.9-slim
WORKDIR /app
COPY . .

# Install compatible versions of packages
RUN pip install fastapi==0.78.0 \
    pydantic==1.9.0 \
    uvicorn==0.17.6 \
    python-dotenv \
    motor \
    pytest \
    python-multipart

# Expose the port
EXPOSE 8000

# Start the server
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]