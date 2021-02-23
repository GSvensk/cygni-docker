# Övning 1: Kom igång med Dockerfile!

Ett "fiktivt" scenario: du kommit till en ny kund som har en legacy nodejs-server applikation. De tidigare utvecklarna har kört den direkt på sina maskiner men på grund av strul med miljöer och versioner så har du beslutat att börja använda Docker för att bygga och köra den. Men hur ska du gå till väga? Vad behöver du tänka på?

## Bekanta dig med applikationen
Du beslutat att det första som behöver göras är att utforska hur applikationen fungerar. Du behöver veta saker som:
* Vad behöver jag för byggverktyg? Vilka bibliotek? Vilka versioner behöver dessa vara? 
* Vilka steg behövs för att bygga applikationen?
* Vilka steg behövs för att starta applikationen?
* Hur kontrollerar vi att applikationen kör som den ska? (bonusuppgift!)

Så för att ta reda på dessa sakerna tänker du att du ska starta en tom container, installera alla dependencies och sedan köra applikationen. När du väl fått igång applikationen så vet du i stora drag hur en `Dockerfile` skulle kunna se ut.

1. På din maskin starta ett shell och navigera till dockerfile-1 mappen.
2. Starta en tom Ubuntu container genom att köra `docker run -it -v $(pwd):/home/app -w /home/app -p 3000:3000 ubuntu:latest`
3. I containern kör `ls`. Du bör bland annat se en `server.js` fil. 
4. För att köra servern så behöver vi ha nodejs och npm. Curl kan dessutom vara bra för att testa att allting fungerar. Allt detta kan vi installera genom att köra: `apt-get update` och sedan `apt-get install -y nodejs npm curl`. 
5. Nu är det dags att installera node depenciences genom att köra `npm install`
6. Till sist är det bara att starta servern genom att köra `node server.js &`. Du bör få som svar `Server is listening on port 3000`.
7. Prova att köra `curl localhost:3000` både inuti containern och maskinen som det körs på för att testa servern. Prova också att starta din webbläsare och skriva in `localhost:3000` i adressfältet.

Vi har nu utforskat steg för steg vad som behövs för att bygga och köra applikationen. Låt oss nu skapa en Dockerfile som motsvarar vad vi gjort ovan.

## Bygg en Docker-container
Skapa en fil som heter `Dockerfile` genom att köra `touch Dockerfile`. Öppna sedan filen i valfri editor och skriv följande kod

```dockerfile
FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y curl

WORKDIR /home/app
COPY . .

RUN npm install

ENTRYPOINT ["node", "server.js"]
```

Bygg imagen genom att köra `docker build -t cygni-docker-lab-1 .`. Detta kommer att bygga en ny image med taggen `cygni-docker-lab-1:latest`.

## Analysera resultatet
Verifiera att den nya imagen finns genom att köra `docker images` och leta upp `cygni-docker-lab-1`.

Hur stor är imagen vi just har byggt?

## Starta servern via docker
För att starta imagen som vi precis byggt kan man köra `docker run --rm -p 3000:3000 --name cygni-docker-lab-1 cygni-docker-lab-1`.
Detta kommer att starta servern och mappa port 3000 på maskinen där den körs mot port 3000 inne i containern. Alla andra portar är stängda!

Prova att interagera med servern på samma sätt som tidigare i steg 7.

Stäng inte ner terminalen utan öppna en ny för nästa steg!

## Tips: starta ett shell i en körande container
Om du vill felsöka inuti en körande container så kan du skapa ett shell (givet att det finns installerat!) med hjälp av `docker exec -it <CONTAINER ID ELLER NAMN> bash`. Du kan hitta container id eller namnet genom att köra `docker ps`. När du klar kan du köra `exit`.

## Docker Hub
På samma sätt som att det går att dela källkod via tex github eller gitlab går det att dela container images via tex dockerhub.
För att hämta ner och köra imagen pong-server som vi byggde tidigare kan du skriva:
```
docker run -p 3001:3001 --name pong-server overraskning/pong-server:v1 
```

Öppna en ny terminal och använda curl för att göra ett anrop till `localhost:3001`.

Vi ska nu försöka göra anrop från den ena containern till den andra.
```
docker exec -it pong-server curl http://cygni-docker-lab-1:3000/ping
```
Vad får du för resultat?

För att den ena containern ska kunna gå att nå från den andra behöver dom vara i samma nätverk.
Se till att du har både `pong-server` och `cygni-docker-lab-1` igång. Sedan kan du skapa ett nätverk och ansluta båda containrarna till detta.
```
docker network create ping-pong
docker network connect ping-pong pong-server
docker network connect ping-pong cygni-docker-lab-1
```
Vad ser du?

## Stoppa servern
Ta reda på vilket id Docker-containern har genom att köra `docker ps`. Stoppa sedan servrarna genom att köra `docker stop <conatinerid>`

### Bonusuppgift: är containern healthy?
Lägg till en health check som kontrollerar att servern är upp och kör. Titta i [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#healthcheck). Du kan se hälsotillståndet genom att köra `docker ps`. När health checken lyckas kommer status att innehålla `(healthy)`.

### Bonusuppgift: begränsa vad som kopieras med .dockerignore
En brist i detta exemplet kan du finna ifall du kör: `docker run -it --entrypoint=/bin/bash cygni-docker-lab-1 -c ls -a`. Då ser du något som borde se ut ungefär såhär:

```bash
.eslintrc.yml
.gitignore
.prettierrc
Dockerfile
README.md
app
node_modules
package-lock.json
package.json
server.js
```

I outputen kan vi se ett antal filer som inte borde följa med när vi ska köra applikationen. Till exempel behöver vi inte ha med `Dockerfile`, `.gitignore` eller `README.md` filen. Men detta är något som vi lätt kan fixa till. 

1. Skapa en fil som heter `.dockerignore`. Syntaxen är sedan liknande som man hittar i en `.gitignore` fil. 
2. Lägg till följande innehåll:
```
.gitignore
Dockerfile
README.md
```
3. Bygg om!
4. Kör sedan `docker run -it --entrypoint=/bin/bash cygni-docker-lab-1 -c ls -a` igen. 

För mer information om `.dockerignore` läs mer [här](https://docs.docker.com/engine/reference/builder/#dockerignore-file)
