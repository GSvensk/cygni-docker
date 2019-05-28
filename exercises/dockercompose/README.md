# Övning: Docker Compose

Här ska vi öva på att starta flera Docker-containers som samverkar i ett virutellt Docker-nätverk.

Vi kommer att starta en MongoDB samt en egen server som läser och sriver till denna.

Allt detta går att göra med enbart docker, men det är betydligt lättare att åstakomma med `docker-compose`.

### Starta MongoDB
I Projektet finns en färdig konfigurationsfil för Docker Compose som heter `docker-compose.yml`.
Öppna filen och ägna en minut åt att försöka förstå vad den gör. Förklara gärna för varandra!

Starta sedan databasen genom att köra följande kommando: `docker-compose up`.

### Bekanta dig med projektet
Installera node-projektet genom att köra `npm install` för att sedan starta servern med `npm start`.

Server kommer nu att starta på port 3000. Notera output från databasen som loggar att en klient koppar upp sig. Stoppa node-servern (`ctrl-c`) och starta om den ifall du missar vad som händer.

Börja med att göra ett request mot serverns endponit `/` genom att köra följande `curl http://localhost:3000`, alternativt köra öppna adressen i din browser.
Servern ska nu svara med `Hello World`.

Öppna upp koden i valfri editor och försök förstå vad den gör. Återigen, föklara gärna för varandra!

Skapa en ny resurs genom att köra `curl -i -H 'content-type: application/json' -d '{"fruit": {"type": "banana", "color": "yellow"}}' -XPOST http://localhost:3000/data`.
Notera adressen till den nya resursen (Hint: Location header) och se om du kan läsa den från API:et - `curl http://localhost:3000/data/<the-new-resource-id>`.

### Skapa en image av servern
Skapa en `Dockerfile`  för servern.
Det inte vara någon optimerad image, utan följande konfiguration duger bra:
```
FROM node:11-alpine
WORKDIR /home/app
COPY . . 
RUN npm install
CMD ["node", "server.js"]
```

### Bygg med Docker Compose
Stoppa databasen genom att köra `ctrl-c`.

Använd samma `Dockerfile` som ovan, en försök istället bygga allt via kommandot `docker-compose build`. 
Skapa en ny service i `docker-compose.yml` och använd attributet `build: .` för att peka ut den `Dockerfile` som ligger i samma katalog.
Se till att båda tjänserna (servern och databasen) kör på samma nätverk samt att du ger servern miljövariabeln `MONGO_HOST=mongo`. _Varför är det nödvändigt? Förklara för varandra!_

Starta slutligen både databasen och servern samtidigit med kommandot `docker-compose up`.

När du är lite varm i kläderna kan du köra båda kommandon i ett svep på följande vis `docker-compose up --build`.

Om du får problem med att servern startar före databasen kan du använda [`depends_on`](https://docs.docker.com/compose/compose-file://docs.docker.com/compose/compose-file/).

Se till att du nu kan köra både servern och databsen enbart genom att köra `docker-compose up`, samt att du kan skapa och läsa nya resurser!

### Stäng databasen!

Slutligen, stäng portarna till databasen och verifiera att det fortfarande går att köra servern. _Hur kan det fortfarande fungera? Diskutera!_
