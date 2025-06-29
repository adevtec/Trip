<?php
/**
 * Lihtne test skript API integratsiooniks
 */

// Kasuta MySQL ühendust otse
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'eksootikareisid';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "=== MySQL Ühendus Õnnestus ===\n";
    
    // Kontrolli wp_options tabelit
    $stmt = $pdo->query("SHOW TABLES LIKE 'wp_options'");
    if ($stmt->rowCount() > 0) {
        echo "wp_options tabel eksisteerib\n";
        
        // Otsi API võtit
        $stmt = $pdo->prepare("SELECT option_value FROM wp_options WHERE option_name = 'novit_api_key'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            echo "API võti leitud: " . $result['option_value'] . "\n";
            
            // Kui see on tegelik krüpteeritud võti, dekrüpteeri
            if (strlen($result['option_value']) > 10) {
                echo "\n=== Dekrüpteeri ===\n";
                
                // Sama krüpteerimise loogika nagu WordPress pluginas
                $encryptMethod = 'AES-256-CBC';
                $secretKey = 'This is my secret key';
                $secretIv = 'This is my secret iv';
                
                $key = hash('sha256', $secretKey);
                $iv = substr(hash('sha256', $secretIv), 0, 16);
                
                try {
                    $decrypted = openssl_decrypt(base64_decode($result['option_value']), $encryptMethod, $key, 0, $iv);
                    if ($decrypted) {
                        echo "Dekrüpteeritud API võti: $decrypted\n";
                        
                        echo "\n=== .env.local UPDATE ===\n";
                        echo "NOVIT_API_KEY=$decrypted\n";
                    } else {
                        echo "Dekrüpteerimine ebaõnnestus - võib-olla see ei ole krüpteeritud\n";
                    }
                } catch (Exception $e) {
                    echo "Dekrüpteerimine ebaõnnestus: " . $e->getMessage() . "\n";
                }
            }
        } else {
            echo "API võtit ei leitud\n";
            echo "Lisa API võti käsitsi:\n";
            echo "INSERT INTO wp_options (option_name, option_value) VALUES ('novit_api_key', 'your_api_key_here');\n";
        }
    } else {
        echo "wp_options tabelit ei leitud\n";
    }
    
} catch (Exception $e) {
    echo "Viga: " . $e->getMessage() . "\n";
}
?>
