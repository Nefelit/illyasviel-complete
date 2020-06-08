# illyasviel music

Бот был создан на коленке и был задуман лишь для моего обучения, возможно очень много говнокода
Однако этот говнокод к счастью не жрет много памяти, от силы 300мб на 100к юзеров.
Поддержка бота прекращена, так как я устал от публичных ботов. Если у вас есть желание поддержать меня, вы можете сделать это материально: qiwi `+7 962 773 33 17`


```js
git clone https://github.com/Nefelit/illyasviel-complete.git
```

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
