# Övning 3: Effektivare Dockerfiles!

I denna övningen så kommer vi att titta på hur vi kan förbättra de `Dockerfile`s som vi skrivit i tidigare övningarna. 

## Varför mindre images är viktigt
Det finns flera anledningar till att mindre images är bättre. 
* En mindre image kräver mindre resurser. Det går snabbare att bygga, ladda upp, ladda ner och kräver mindre resurser att köra. Detta kan göra enorm skillnad när man behöver köra ett stort antal containers.
* En mindre image med färre paket har mindre programvara som kan ha säkerhetsbrister. 

**TIPS** Du kan slå på vulnerability scanning i AWS ECR eller Azure.

Så hur kan vi göra våra images mindre? Det finns flera sätt men de två effektivaste är:

* Att använda multi-stage build.
* Att använda mindre base images.

Vi kommer nu att prova att förbättra våra images från tidigare övningar.

## Att använda multi-stage builds tillsammans med minimala base images
Låt oss utgå från de images som vi byggt i tidigare övningar. Kontrollera storleken på tidigare images genom att köra `docker images cygni-*`. 

Fördelen med multi-stage builds är att vi kan ha en stor base image för att bygga med och sedan en mindre image för att faktiskt köra vår applikation. I förra övningen byggde vi med imagen `golang:1.15.5-buster` vilket är smidigt när man ska bygga koden men den är för stor för att distribuera och köra i produktion. Men med multi-stage så kan vi kopiera artefakten från bygg steget till en minimal image som enbart har det som behövs för att köra applikationen. Vanligtvis brukar minimala images vara någon form av `alpine`, `scratch` eller det vi nu ska använda: `distroless`. 

**Framtida referens** Du behöver inte läsa detta nu men här kan du läsa mer om Distroless
* [thoughtworks](https://www.thoughtworks.com/radar/techniques/distroless-docker-images)
* [Github](https://github.com/GoogleContainerTools/distroless)

I mappen dockerfile-3 finns en `Dockerfile` som liknar den vi skrev i övning 2 men med ett antal placeholders Låt oss nu göra om den till en multi-stage build.

Dockerfile innan våra ändringar:
```dockerfile
#TODO 1 LÄGG TILL AS på raden under
FROM golang:1.15.5-buster
WORKDIR /app
COPY hello-world.go .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o hello-world
#TODO 2 Lägg till ny FROM
#TODO 3 Lägg till WORKDIR
#TODO 4 Lägg till COPY 
ENTRYPOINT ["/app/hello-world"]
CMD ["defaultArg"]
```

Vi behöver göra följande ändringar: 
1. Ändra TODO 1 `FROM golang:1.15.5-buster` till `FROM golang:1.15.5-buster AS builder` så att vi kan enkelt referera till den senare.
2. Vi behöver nu ange en base image som vår container ska använda vid körning. Ersätt TODO 2 med`FROM gcr.io/distroless/static-debian10`
3. Vi vill sätta samma WORKDIR igen. Ersätt TODO 3 med `WORKDIR /app`
4. Slutligen vill vi kopiera det kompilerade programmet från bygg imagen (`builder`) till vår nya image. Ersätt TODO 4 med: `COPY --from=builder /app/hello-world .`

5. Bygg en image med `docker build -t cygni-docker-lab-3 .`
6. Kör imagen för att försäkra dig om att den fortfarande fungerar. Gör samma test som i Övning 2.
7. Jämför storleken på den nya imagen och den gamla genom att köra `docker images cygni-*`

**Framtida referens** [Dockerfile bast practicies: multi-stage-builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds)

## Använd färdiga images 
I övning 1 så använde vi base imagen `ubuntu:latest` vilket innebar att vi fick själva installera nodejs och npm. Men i övning 2 och 3 så använde vi oss av en officell Go image och behövde därför inte installera något. Skriv om Dockerfilen i övning 1 så att den istället använder `node:buster` och ta bort det som inte längre behövs. 

Om du vill experimentera lite innan som vi gjorde i övning 1 så kan du köra `docker run -it -v $(pwd):/home/app -w /home/app -p 3000:3000 node:buster bash`

Går det att använda multi-stage builds?

[Mer information om node imagen finns på Dockerhub](https://hub.docker.com/_/node). 

## Bonusuppgift: Linting med Hadolint
Ett sätt att få hjälp med att skriva bättre Dockerfiles är att använda lintern Hadolint. Prova att köra den på Dockerfiles från tidigare övningar och fixa problemen som rapporteras. Prova även på eventuella Dockerfiles från uppdraget.

`docker run --rm -i hadolint/hadolint:v1.19.0 < ./Dockerfile`

Mer information om [Hadolint](https://github.com/hadolint/hadolint).

## Bonusuppgift: Att använda override för ENTRYPOINT
Bara för att vi satt en viss ENTRYPOINT betyder inte det att vi inte kan sätta en annan. Ett exempel på detta såg vi i övning 2 där vi använder `--entrypoint` för att sätta bash som entrypoint.

Läs mer om att hur det går att göra override på olika saker i images [här](https://docs.docker.com/engine/reference/run/#entrypoint-default-command-to-execute-at-runtime).

Prova sedan att göra en override på vår senaste image som vi byggt så att du startar `/bin/bash` istället.

## Bonustips: flera Dockerfiles i samma mapp
Om man inte anger ett filnamn åt `docker build` så kommer den att anta att den ska bygga en lokal fil som heter `Dockerfile`. Men du kan ange ett annat filnamn genom att lägga till argumentet `-f FILENAME`. Detta kan vara smidigt om du vill arbeta med flera Dockerfiles samtidigt i samma mapp.