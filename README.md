## Testez une application full-stack

L’objectif de ce projet est de finaliser la phase de tests pour une application de studio de yoga appelée Savasana. Vous êtes responsable de terminer le processus de test, couvrant le Front-End, le Back-End et les fonctionnalités de bout en bout (end-to-end). Des tests approfondis sont essentiels pour assurer une couverture de code minimale de 80 %, dont au moins 30 % provenant de tests d’intégration. Une fois cela réalisé, il faudra soumettre les rapports de couverture ainsi que le code sur GitHub, accompagné d’un README expliquant comment lancer l’application. Il est aussi attendu que vous prépariez une présentation à destination du responsable.

## Prérequis

Avant de commencer, assurez-vous d’avoir installé les logiciels suivants sur votre système :

- **Java Development Kit (JDK) :** Suivez les instructions ci-dessous pour installer le JDK.
- **Apache Maven :** Installez [Maven](https://maven.apache.org/) pour construire et gérer les dépendances du projet.
- **Node.js :** Installez [Node.js LTS](https://nodejs.org/en) pour installer les dépendances du Front-End.

## Configuration


1. **Java Development Kit (JDK) :** Installez Java version 8 Zulu (JavaSE-1.8) en utilisant [SDKMAN](https://sdkman.io/), un outil pour gérer les kits de développement. SDKMAN simplifie l’installation et la gestion des versions.

   - **Installer SDKMAN :**

     Si vous n’avez pas 7-Zip installé, vous pouvez le télécharger sur [leur site officiel](https://www.7-zip.org/).

     Ensuite, dans un terminal GitBash (exécuté en administrateur), lancez ces commandes :

     ```shell
     # Pour installer 7zip
     ln -s /c/Program\ Files/7-Zip/7z.exe /c/Program\ Files/Git/mingw64/bin/zip.exe

     # Pour installer SDKMAN
     export SDKMAN_DIR="/c/sdkman" && curl -s "https://get.sdkman.io" | bash
     ```

     Pour installer Java version 8, lancez la commande suivante :

     ```shell
     sdk install java 8.0.302-zulu
     ```

     Assurez-vous que la variable d’environnement Java est correctement configurée sur votre système. Cette variable est essentielle pour exécuter les applications Java.

     - **Sous Windows :**
       1. Ouvrez les Propriétés système.
       2. Cliquez sur l’onglet `Avancé`.
       3. Cliquez sur le bouton `Variables d’environnement`.
       4. Sous `Variables système`, créez une nouvelle variable nommée `JAVA_HOME`.
       5. Ajoutez le chemin du dossier binaire de votre JDK (par exemple : `C:\sdkman\candidates\java\[NOM DE VERSION JAVA]\bin`)
       6. Cliquez sur `OK` pour enregistrer vos modifications.

     Redémarrez votre ordinateur puis vérifiez la version de Java installée :

     ```shell
     java -version
     ```

### Back-End

   Une fois le dépôt cloné, ajoutez le fichier `application.properties` dans le dossier `src/main/resources/` avec le contenu suivant :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/test?allowPublicKeyRetrieval=true
spring.datasource.username=user
spring.datasource.password=123456

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.show-sql=true
oc.app.jwtSecret=openclassrooms
oc.app.jwtExpirationMs=86400000
```

2. Installez les dépendances du projet avec la commande suivante : `mvn clean install`

3. Lancez l’application via votre IDE ou en exécutant la commande suivante dans le répertoire du projet :

4. Pour générer la couverture de code du back-end, exécutez la commande suivante : `mvn clean test`

## Rapports de couverture de code

### Front-End

Obtenir la couverture de code des tests pour le Front-End (Angular) :

- Pour lancer les tests et obtenir la couverture de code du Front-End Angular, vous pouvez utiliser la commande Jest :

```shell
jest -t --coverage
```

- Pour obtenir la couverture des tests E2E Cypress, utilisez la commande suivante :

```shell
npm run e2e:coverage
```

Une fois l’exécution terminée, le terminal affiche le résultat des tests (succès/échec), accompagné d’un tableau récapitulatif du pourcentage de couverture du code.

### Back-End

Obtenir la couverture de code des tests pour le Back-End (Spring Boot) :

- Exécutez la commande suivante dans le terminal pour lancer les tests et générer un rapport de couverture avec JaCoCo pour le back-end Spring Boot :

```shell
mvn clean test jacoco:report
```

Après exécution, localisez et ouvrez dans votre navigateur le fichier index.html du rapport de couverture, situé dans le dossier target/site/jacoco du projet.

## Divers

<details>
  <summary>
📚 API documentation
  </summary>
  <table>
  <thead>
    <tr>
       <th>Endpoint</th>
       <th>Method</th>
       <th>Description</th>
    </tr>
  </thead>
  <tbody>
  <tr>
        <td>/api/auth/login</td>
        <td>POST</td>
        <td>User authentication</td>
    </tr>
    <tr>
        <td>/api/auth/register</td>
        <td>POST</td>
        <td>User registration</td>
    </tr>
    <tr>
        <td>/api/session</td>
        <td>GET</td>
        <td>Retrieve all sessions</td>
    </tr>
    <tr>
        <td>/api/session</td>
        <td>POST</td>
        <td>Create a new session</td>
    </tr>
    <tr>
        <td>/api/session/{id}</td>
        <td>DELETE</td>
        <td>Delete a session by ID</td>
    </tr>
    <tr>
        <td>/api/session/{id}</td>
        <td>GET</td>
        <td>Retrieve a session by ID</td>
    </tr>
    <tr>
        <td>/api/session/{id}</td>
        <td>PUT</td>
        <td>Update a session by ID</td>
    </tr>
    <tr>
        <td>/api/session/{id}/participate/{userId}</td>
        <td>DELETE</td>
        <td>Remove user participation</td>
    </tr>
    <tr>
        <td>/api/session/{id}/participate/{userId}</td>
        <td>POST</td>
        <td>Add user participation</td>
    </tr>
    <tr>
        <td>/api/teacher</td>
        <td>GET</td>
        <td>Retrieve all teachers</td>
    </tr>
    <tr>
        <td>/api/teacher/{id}</td>
        <td>GET</td>
        <td>Retrieve a teacher by ID</td>
    </tr>
    <tr>
        <td>/api/user/{id}</td>
        <td>DELETE</td>
        <td>Delete a user by ID</td>
    </tr>
    <tr>
        <td>/api/user/{id}</td>
        <td>GET</td>
        <td>Retrieve a user by ID</td>
    </tr>
  </tbody>
</table>
</details>

<details>
  <summary>🔗 Link to the original Repository</summary>
  <a href="https://github.com/OpenClassrooms-Student-Center/Testez-une-application-full-stack">
    Link to the original code
  </a>
</details>