### Sommaire

1. [Documentation utilisateur](#documentation-utilisateur)
2. [Déploiement avec Docker](#déploiement-avec-docker)
3. [Déploiement sans Docker](#déploiement-sans-docker)
4. [Mobioos Forge](#mobioos-forge)

# Documentation utilisateur

La documentation utilisateur est dans [user_doc.pdf](user_doc.pdf).

# Déploiement avec Docker

⚠️ Permet de lancer l'application avec toutes les fonctionnalités. Pas les variants générés avec Mobioos Forge. ⚠️

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

Il peut arriver que le conteneur contenant l'application Spring se lance avant celui avec la base de données ce qui cause une erreur.

Dans ce cas il faut faire CTRL+C pour stopper tous les conteneurs et refaire `docker-compose up`


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
java -jar ./devrep-projet1-0.0.1-SNAPSHOT.jar
```

## Lancer le frontend
Dans le dossier frontend exécuter : 
```shell
npm install
npm run dev
```

## Accéder à l'application

L'application est accessible à l'URL : <http://localhost:3000>



## Documentation de l'API REST OpenAPI
En lançant l'application sans docker on peut accéder à Swagger et bénéficier des ses fonctionnalités sur l'API.  
Url Swagger: <http://localhost:8080/swagger-ui/index.html>


# Mobioos Forge

## Création de variants

Se fait selon la procédure décrite dans la documentation de Mobioos Forge.

## Lancement des variants

### Backend
À la racine du projet executer : 
```shell
mvn package -DskipTests
java -jar target/devrep-projet1-0.0.1-SNAPSHOT.jar
```

### Frontend 
Dans le dossier frontend exécuter :

```shell
npm rebuild
npm run dev
```

