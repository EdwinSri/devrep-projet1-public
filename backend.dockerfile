FROM eclipse-temurin:17
RUN mkdir -p /app
WORKDIR /app
COPY *.jar ./app.jar
EXPOSE $PORT
CMD [ "java", "-jar", "./app.jar" ]