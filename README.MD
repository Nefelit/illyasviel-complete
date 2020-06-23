# illyasviel music

Бот был создан на коленке и был задуман лишь для моего обучения, возможно очень много говнокода
Однако этот говнокод к счастью не жрет много памяти, от силы 300мб на 100к юзеров.

Поддержка бота прекращена, так как я устал от публичных ботов.

Если у вас есть желание поддержать меня, вы можете сделать это материально: qiwi `+7 962 773 33 17`


```js
git clone https://github.com/Nefelit/illyasviel-complete.git
```

# PREVIEW

> Simle 

![NP](https://nefelit.design/1a72674575d9e713.png)

> Flags and reactions

![NP FLAGS AND REACTIONS](https://nefelit.design/a498c7d1803441b3.png)


> Details | User music library | User music history

![DETAILS MUSIC LIBRARY](https://nefelit.design/66ebee1ad29d412a.png)
![HISTORY](https://nefelit.design/8765dd4818099735.png)

> Clear Queue starting at 0

![QUEUE](https://nefelit.design/406ec09642dd8c50.png)

> Flags usage | SHUFFLE

![FLAGS](https://nefelit.design/9664ade4e8a67445.png)

> Sleep timer

![SLEEP TIMER](https://nefelit.design/9b9a914407911690.png)

> Handle all fails

![FUCK](https://nefelit.design/3416ca05b2ee9315.png)

> Search command (UP TO 30 songs)

![SEARCH](https://nefelit.design/2e88bb3a6404d0b9.png)

> Load all songs by author name or by tag or part of name!

![bruh](https://nefelit.design/4e85e82bd6584838.png)
![bruh](https://nefelit.design/8b91c99a036b1ad6.png)

See all commands at https://aspire.su/commands


# WEBSITE

> SOCKET system | Tracto design

![web](https://nefelit.design/40d4ceeb4e3a0b12.png)

> Videos with website

https://saphire.is-inside.me/mGKbbXDT.mp4

https://saphire.is-inside.me/QOScXTo6.mp4

# ISTALL 

Enmap BetterSqlite3 зависимости 

```
sudo apt install gcc g++ make
```

`yarn` или `npm i`

Информация об рабочей версии на 08.06.2020

```
Version:        606fbf3ca475d39e15183fe91ab0149fa17d0fe9-SNAPSHOT
Build:          1061
Build time:     29.05.2020 10:23:19 UTC
Branch          master
Commit:         606fbf3
Commit time:    29.05.2020 10:19:10 UTC
JVM:            11.0.2
Lavaplayer      1.3.49
```

![img](https://media.discordapp.net/attachments/689087727131426892/719591796815953930/2020-06-08_23-39.png)

```js
server {

    server_name aspire.su; # замените на свой вебсайт

    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
     }
}
```
Используйте `certbot --ngnix`, затем обновите название домена в боте

Селфхостинг на хероку не проверялся, требуется активный лавалинк, хотя бы 1 штука для запуска.
Мне лень оставлять дамп и скелет базы данных.

```
+----------------------+
| Tables_in_illyasviel |
+----------------------+
| Analytics            |
| Blog                 |
| Guilds               |
| Playlist             |
| Users                |
| blacklist            |
| libs                 |
+----------------------+
```

```
mysql> SHOW COLUMNS FROM Playlist;
+-----------+--------------+------+-----+-------------------+----------------+
| Field     | Type         | Null | Key | Default           | Extra          |
+-----------+--------------+------+-----+-------------------+----------------+
| name      | varchar(255) | NO   |     | NULL              |                |
| owner     | varchar(20)  | NO   |     | NULL              |                |
| hidden    | int(1)       | NO   |     | 1                 |                |
| songs     | json         | YES  |     | NULL              |                |
| createdAt | datetime     | YES  |     | CURRENT_TIMESTAMP |                |
| id        | int(11)      | NO   | PRI | NULL              | auto_increment |
+-----------+--------------+------+-----+-------------------+----------------+
```


```
mysql> SHOW COLUMNS FROM blacklist;
+----------+-------------+------+-----+-------------------+----------------+
| Field    | Type        | Null | Key | Default           | Extra          |
+----------+-------------+------+-----+-------------------+----------------+
| entry_id | int(11)     | NO   | PRI | NULL              | auto_increment |
| id       | varchar(20) | NO   |     | NULL              |                |
| reason   | text        | NO   |     | NULL              |                |
| date     | timestamp   | NO   |     | CURRENT_TIMESTAMP |                |
| type     | varchar(10) | NO   |     | user              |                |
+----------+-------------+------+-----+-------------------+----------------+
```


```
mysql> SHOW COLUMNS FROM Guilds;
+---------------+--------------+------+-----+---------+----------------+
| Field         | Type         | Null | Key | Default | Extra          |
+---------------+--------------+------+-----+---------+----------------+
| entry_id      | int(11)      | NO   | PRI | NULL    | auto_increment |
| id            | varchar(20)  | NO   |     | NULL    |                |
| prefix        | varchar(10)  | NO   |     | i!      |                |
| premium       | int(1)       | NO   |     | 0       |                |
| defaultVolume | int(10)      | NO   |     | 20      |                |
| delayTime     | int(255)     | YES  |     | NULL    |                |
| radioMode     | varchar(18)  | NO   |     | 0       |                |
| looping       | int(1)       | NO   |     | 0       |                |
| radioURI      | varchar(255) | YES  |     | NULL    |                |
| language      | varchar(10)  | NO   |     | ru      |                |
+---------------+--------------+------+-----+---------+----------------+
```


Спасибо. Если у вас есть желание, можете копировать и развивать этого бота, либо использовать его как личного.
