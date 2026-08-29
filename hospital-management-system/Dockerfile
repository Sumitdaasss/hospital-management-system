# Stage 1: Build Spring Boot application
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven configuration
COPY pom.xml .

# Copy source code
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests


# Stage 2: Run Spring Boot application
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy generated JAR from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]