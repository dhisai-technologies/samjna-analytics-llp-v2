FROM python:3.12

RUN apt-get update -y
RUN apt-get install -y libhdf5-dev libsndfile1 libgl1 flac cmake

WORKDIR /app

COPY ./services/analytics/requirements.txt /app/requirements.txt

RUN pip install --default-timeout=100 --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./services/analytics/app /app/app

ARG PORT=5002
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["sh", "-c", "uvicorn app.main:app --reload --host 0.0.0.0 --port ${PORT} --timeout-keep-alive 300"]