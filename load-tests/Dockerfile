FROM loadimpact/k6
COPY ./tests /tests
WORKDIR /tests
# Override the entry point of the base k6 image
ENTRYPOINT []
CMD ["sh", "-c", "k6 run --vus $K6_VUS --duration $K6_DURATION -e TEST_URL=$K6_TEST_URL $K6_SCRIPT"]
