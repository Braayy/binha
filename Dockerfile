FROM oven/bun:1.0

WORKDIR /app

COPY . .

RUN bun install

CMD ["bun", "start", "/var/rinha/source.rinha.json"]