# Övning: Dockerfile

Här ska vi öva på att skriva en `Dockerfile`. 

För att göra det har vi en enkel node-server till vilken vi ska bygga en container.

### Bekanta dig med projektet
Installera node-projektet genom att köra `npm install` för att sedan starta servern med `npm start`.

Server kommer nu att starta på port 3000. 
Börja med att göra ett request mot serverns endponit `/` genom att köra följande `curl http://localhost:3000`, alternativt köra öppna adressen i din browser.
Servern ska nu svara med `Hello World`.

Öppna nu filen `./app/app.js` och titta på koden. Vad tror du att servern kommer att svara under resursen `/host`?

Kör följande `curl http://localhost:3000/host` och skriv ner resultatet på ett papper.

### Bygg en Docker-container
Skapa en fil som heter `Dockerfile` genom att köra `touch Dockerfile`.
Öppna sedan filen i valfri editor och skriv följande kod

```
FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm

WORKDIR /home/app
COPY . .

RUN npm install

CMD ["node", "server.js"]
```

I denna fil händer följande
1. Basera denna image på senaste Ubuntu.
2. Uppdatera cachen till Ubuntus repositories.
3. Installera Nodejs.
4. Installera npm.
5. Skapa en arbetsyta inne i containern.
6. Kopiera in alla filer till arbetsytan.
7. Installera node-projektet inne i containern.
8. Skapa ett default-kommando som körs när servern startar (om inget annat anges).

Bygg imagen genom att köra `docker build -t cygni-docker-lab-1 .`.
Detta kommer att bygga en ny image med taggen `cygni-docker-lab-1:latest`.

### Analysera resultatet
Verifiera att den nya imagen finns genom att köra `docker images` och leta upp `cygni-docker-lab-1`.

Hur stor är imagen vi just har byggt? 

### Starta servern via Docker
För att starta servern kan man köra `docker run --rm -p 3000:3000 cygni-docker-lab-1`.
Detta kommer att starta servern, via Docker, och mappa port 3000 på maskinen där den körs mot port 3000 inne i containern - alla andra portar är stängda!

Prova att interagera med servern på samma sätt som tidigare. Vad svara servern under `/hosts` den här gången?

### Stoppa servern
Ta reda på vilket id Docker-containern har genom att köra `docker ps`.
Stoppa sedan servern genom att köra `docker stop <conatinerid>`.

## Optimera
### Alpine
Den image som vi har byggt nu är baserad på operativsystemet Ubuntu. Ubuntu är ett utmärkt operativsystem att köra på sin server, men det är anpassat för att köra direkt på hårdvaran.
Vill man ha en mer lättviktig image (det vill man!) så kan man istället använda en Linux-distribution som är anpassad för att köras i Docker-miljö.
Den vanligaste sådana distributionen är `Alpine`.

Uppdatera din `Dockerfile` till att använda Alpine istället för Ubuntu. Hint: Använd `alpine:latest` och `apk` istället för `apt`. (Det är ok att googla lite)

### Analysera resultatet
Hur stor är imagen vi just har byggt? 

### Starta servern via Docker
Starta på samma sätt som tidigare. 

Vad svarar servern under `/hosts` den här gången? Vad svarar den om du startar om servern?

## Optimera mera
Fundera på vad som egentligen händer när du bygger din image? Vad sker i vilka steg?
Spelar det någon roll i vilken ordning vi gör de olika stegen? Får vi med en massa onödiga filer från bygget som sedan inte används när vi kör servern?
Skriv ner era tankar om detta - vi diskuterar i grupp efter övningen.

### Multi stage builds
Ett mycket effektivt sätt att använda dockers lagerarkitektur är att använda sig av s.k. `Multi Stage Builds`.
Med en sådan kan man använda sig av olika base-images för att till exempel bygga koden och köra koden.
Det är helt firtt att förlita sig på befintliga images, eller skapa sina egna. Eftersom Docker även cachar de olika lagren så kan man uppnå väldigt snabba byggtider genom att dela gemensamma base-images.

Här är ett exempel på hur en multi-stage-build kan se ut:
```
FROM golang:1.7.3
WORKDIR /go/src/github.com/alexellis/href-counter/
RUN go get -d -v golang.org/x/net/html  
COPY app.go .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=0 /go/src/github.com/alexellis/href-counter/app .
CMD ["./app"]  
```

Försök nu använda multi-stage-build för att ytterligare optimera vår server image. _Hur liten kan den bli?_

## Använd färdiga images
Det vanligaste sättet att bygga images är inte att bygga egna från början som vi har gjort hittils. 
Istället använder man oftast färdiga base-images från t.ex. [Docker Hub](https://hub.docker.com/). (Faktum är att det är precis det vi har gjort med både Ubuntu och Alpine).

Försök hitta en lämplig base-image som vi kan använda istället för att behöva installera nodejs själva. 
Använd denna och försök se om det går att optimera vår image ytterligare?
