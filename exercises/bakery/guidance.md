# Lösningar för Lab 1 och Lab 2

Känner ni att det blir för svårt, så kolla då här för att få ledning.

### LAB 1

2. docker build -t hampusbakery .
3. docker image ls
4. Den startade på localhost:8000
5. None
6. None
7. `docker run -d -p 8000:8000 -e DJANGO_SECRET_KEY='test' {yourimage}`
8. `docker container ls eller docker ps` (för att lista conteiners)
9. `docker container ls --all` (för att lista även stoppade containers)
10. None
11. `docker exec -it {containerID} /bin/bash` Kör sedan kommandot.

12. Börja kolla loggen med hjälp av:

    - `docker logs {containerID}`.

    Något problem med permissions va?

13. Inuti containern kör:

    - cd .. för att gå till top
    - chmod 777 /code
    - cd /code
    - chmod 777 db.sqllite

14. None
15.

### LAB 2

1. None
2. None
3. ```
   services:
       db:
           environment:
           POSTGRES_DB: app_db
           POSTGRES_USER: app_user
           POSTGRES_PASSWORD: changeme
   ```
4. None
5. ```
   services:
       app:
           depends_on:
             - db
   ```
6. None
7. ```
   services:
       db:
           volumes:
              - wagdb:/var/lib/postgresql/data
   volumes:
       wagdb:
   ```
8. ´´´networks:
   my-network:
   driver: bridge
   ´´´
   Specificera sedan _networks: -my-network_ i din service.
