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