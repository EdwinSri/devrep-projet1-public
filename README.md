# Déploiement avec Docker
## Dépendances
- Docker
- docker-compose 

## Lancement
Dans un terminal à la racine du projet exécuter :

```shell
docker-compose build
docker-compose up
```

L'application est alors accessible à l'URL : <http://localhost:3000>


# Déploiement sans Docker

## Dépendances
- Npm pour le frontend
- MySQL avec un serveur attaché au port 3306
- Java
## Créer la base de données MySQL
Il faut s'identifier en tant que root sur le serveur MySQL et exécuter ces commandes

```mysql
CREATE DATABASE devrep_projet1;
CREATE USER 'devrep'@'localhost' IDENTIFIED BY 'devrep';
GRANT ALL PRIVILEGES on devrep_projet1.* TO 'devrep'@'localhost';
FLUSH PRIVILEGES;
```

## Lancer le backend
Dans un terminal à la racine du projet exécuter :

```shell
java -jar ./devrep-projet1.jar
```

## Lancer le frontend
```shell
npm install
npm run dev
```

## Accéder à l'application

L'application est accessible à l'URL : <http://localhost:3000>



# Documentation de l'API REST OpenAPI
Url Swagger: <http://localhost:8080/swagger-ui/index.html>