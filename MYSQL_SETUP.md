# MySQL ja API võtme seadistamise juhend

## Hetke olukord
✅ .env.local fail on loodud andmetega:
- DB_USER=taskuser  
- DB_PASSWORD=taskpassword
- DB_NAME=eksootikareisid
- Krüpteerimise võtmed on seadistatud

❌ MySQL server ei tööta hetkel

## Järgmised sammud

### 1. MySQL käivitamine

Kuna MySQL on error olekus, võid proovida:

```bash
# Võimalik 1: Taaskäivita MySQL service
brew services restart mysql

# Võimalik 2: Käivita käsitsi
sudo /usr/local/bin/mysqld_safe --datadir=/usr/local/var/mysql

# Võimalik 3: Kontrolli MySQL log'e
tail -f /usr/local/var/mysql/*.err
```

### 2. Kasutaja loomine (kui MySQL töötab)

```sql
# Ühenda MySQL-iga kui root
mysql -u root -p

# Loo kasutaja taskuser
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'taskpassword';

# Anna õigused
GRANT ALL PRIVILEGES ON eksootikareisid.* TO 'taskuser'@'localhost';
GRANT ALL PRIVILEGES ON wordpress.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;

# Loo andmebaas
CREATE DATABASE eksootikareisid CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. WordPress andmete import

Kui MySQL töötab, leiad WordPress andmed wp-content'ist ja saad API võtme kätte:

```bash
# Käivita API võtme skript
cd wp-content
php get_api_key.php
```

### 4. Testi ühendust

```bash
# Testi andmebaasi ühendust
node test_mysql.js

# Testi API integratsioon
npm run dev
# Mine: http://localhost:3000/api-integration/api/health
```

### 5. Alternatiivid

Kui MySQL ei taha käivituda:

**Docker variant:**
```bash
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=taskpassword -e MYSQL_DATABASE=eksootikareisid -e MYSQL_USER=taskuser -e MYSQL_PASSWORD=taskpassword -p 3306:3306 -d mysql:8.0
```

**MAMP/XAMPP variant:**
- Paigalda MAMP Pro
- Käivita MySQL seal
- Loo sama kasutaja ja andmebaas

## Praegune integratsioon

Hetkel on valmis:
- ✅ API integration kood (api-integration/ kaustas)
- ✅ Environment variables (.env.local)
- ✅ Krüpteerimise võtmed
- ✅ TypeScript tüübid ja hooks
- ✅ Next.js API routes

Puudub ainult:
- ❌ Töötav MySQL server
- ❌ Tegelik API võti (saad wp-content'ist kui MySQL töötab)

Kui MySQL saad käima, siis kogu süsteem peaks töötama!
