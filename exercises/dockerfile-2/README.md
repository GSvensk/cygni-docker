# Övning 2: En Dockerfile från grunden

I denna övningen så kommer du att skriva en `Dockerfile` från grunden åt en Golang applikation. Vi kommer att gå igenom olika kommandon som en Dockerfile består av och utforska vad dessa gör.

Om behöver mer information om något kommando så läs gärna [Dockerfile reference](https://docs.docker.com/engine/reference/builder/).

## Skapa en tom Dockerfile
Skapa en tom Dockerfile med hjälp av `touch Dockerfile`.

### FROM - Ange base image
I förra övningen så använde vi `ubuntu:latest` som base image och installerade sedan nodejs på den. Vi hade kunnat göra samma sak med Golang men det finns ett bättre val: att använda en officiell image med Go förinstallerat.

Du kan läsa mer om denna imagen på [Dockerhub](https://hub.docker.com/_/golang).

1. I vår tomma `Dockerfile` lägg till första raden: `FROM golang:1.15.5-buster` 
2. Bygg sedan med: `docker build -t cygni-docker-lab-2 .`. 
3. Kontrollera storleken på imagen genom att köra `docker images`. I skrivande stund är imagen **839MB**.

### WORKDIR - Vilken mapp ska vi stå i
Av praktiska skäl är det enklare och tydligare att utgå från en specifik mapp inuti containern.

1. Börja med att kontrollera vilken mapp vi är just nu. Kör `docker run -it cygni-docker-lab-2 pwd`. 
2. Lägg till en ny rad i din Dockerfile: `WORKDIR /app`.
3. Bygg om med: `docker build -t cygni-docker-lab-2 .` 
4. Kör som i steg 1. Du bör nu se att du står i `/app`

Notera att när du bygger om så skriver Docker ut "Using cache" i outputen för intermediate layers. Detta betyder att Docker inte bygger om dessa lager eftersom lagren inte ändrats. Men när ett lager ändras så kommer det och alla efterföljande lager att behöva byggas om. Det är därför viktigt att lägga saker som ofta ändras så sent som möjligt i en Dockerfile. 

### COPY - Lägg till källkoden till imagen
Det finns egentligen två sätt att lägga till saker till imagen: `COPY` och `ADD`. Tumregeln är att använda `COPY` om du kan men du kan behöva använda `ADD` om du ska t ex ladda ner saker.

1. Lägg till en ny rad i din Dockerfile: `COPY hello-world.go .`
2. Bygg om!
3. Kontrollera att filen finns med i imagen: `docker run -it cygni-docker-lab-2 ls`

### Kort om "intermediate images"
När vi byggde steg innan så såg det ut något i stil med detta:
```bash
Sending build context to Docker daemon  11.26kB
Step 1/3 : FROM golang:1.15.5-buster
 ---> 6d8772fbd285
Step 2/3 : WORKDIR /app
 ---> Running in 9d37ecfd6ecc
Removing intermediate container 9d37ecfd6ecc
 ---> 309146aa9871
Step 3/3 : COPY hello-world.go .
 ---> 159fed1dd55b
Successfully built 159fed1dd55b
Successfully tagged cygni-docker-lab-2:latest
```
Vi kan se att bygget har tre "Steps" och att varje step skapar ett lager (6d8772fbd285, 309146aa9871 och 159fed1dd55b). Var och en av dessa går att köra. **OBS** Era lager kommer att ha andra namn.

Om vi till exempel kör lagret `309146aa9871` så kommer det vara innan `hello-world.go` läggs till och därför är mappen tom. Men när vi kör lagret efter `159fed1dd55b` så kommer filen att ligga där. 

```bash
$ docker run -it 309146aa9871 ls
$ docker run -it 159fed1dd55b ls
hello-world.go
```

Detta kan vara praktiskt för att felsöka byggen som inte fungerar. Vi kan även starta bash i imagen för att utforska på det sättet som vi gjorde i övning 1 genom att köra `docker run -it cygni-docker-lab-2 bash`. Prova sedan att köra `ls`, `pwd` och `go run hello-world.go`

### RUN - Köra shell kommandon
Med källkoden tillagd är det dags att bygga `hello-world.go` koden. Tidigare använde vi `RUN` för att installera paket med hjälp av `apt-get` men nu ska vi använda det för att kompilera koden. 

* Lägg till en ny rad i Dockerfilen: `RUN go build -o hello-world`
* Bygg om och inspektera på liknande sätt som du gjorde i steget ovan.

## Hur ENTRYPOINT och CMD fungerar tillsammans
Nu när vi byggt programmet så återstår bara att vi ska starta programmet. För att göra detta så kommer vi att använda ENTRYPOINT och CMD tillsammans. Den förstnämnda kan vi använda för att ange vilket program som ska köras, medan den andra kan användas för att skicka default värden till detta programmet.

### Ange vad som ska köras när en container skapas
För att ange vad som ska köras när vi skapar en container använder vi `ENTRYPOINT`. 

* Lägg till följande i Dockerfilen `ENTRYPOINT ["/app/hello-world"]`
* Bygg om. 
* Kör följande: `docker run cygni-docker-lab-2`
* Kör även: `docker run cygni-docker-lab-2 arg1 arg2`. Notera att vi även får med argument till vårt program.

**TIPS** Det går att ange en annan entrypoint genom att använda `--entrypoint` när man kör Docker. T ex `docker run -it --entrypoint /bin/bash cygni-docker-lab-2`.

### Ange default argument med hjälp av CMD
Ett sätt att ange default argument är att använda sig av `CMD`. 

* Lägg till i Dockerfilen: `CMD ["defaultArg"]`
* Prova att köra både med och utan argument som du gjorde ovan.

**Framtida referens**: Du kan läsa mer om `CMD` och `ENTRYPOINT` [här](https://docs.docker.com/engine/reference/builder/#understand-how-cmd-and-entrypoint-interact).
