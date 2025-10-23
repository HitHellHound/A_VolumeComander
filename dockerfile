FROM openjdk:17-jdk-alpine
COPY backend/build/libs/avolumecommander-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir volume
ENTRYPOINT ["java","-jar","/app.jar"]