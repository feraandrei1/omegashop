<?php
defined('admin') or exit;

set_time_limit(0);

if (isset($_GET['action']) && $_GET['action'] == 'media') {
    
    if (isset($_POST['total_files']) && (int)$_POST['total_files'] > 0) {
        
        for ($i = 0; $i < (int)$_POST['total_files']; $i++) {
            
            if (isset($_FILES['file_' . $i]) && !empty($_FILES['file_' . $i]['tmp_name'])) {
                $file_name = $_FILES['file_' . $i]['name'];
                
                $j = 1;
                while (file_exists('../uploads/' . $file_name)) {           
                    $file_name = $j . '-' . $_FILES['file_' . $i]['name'];
                    $j++;
                }
                $media_path = '../uploads/' . $file_name;
                move_uploaded_file($_FILES['file_' . $i]['tmp_name'], $media_path);
                $stmt = $pdo->prepare('INSERT INTO media (title, caption, date_uploaded, full_path) VALUES (?, ?, ?, ?)');
                $stmt->execute([ $file_name, '', date('Y-m-d H:i:s'), substr($media_path, strlen('../')) ]);
            }
        }
    }
    
    if (isset($_GET['id'])) {
        
        $stmt = $pdo->prepare('SELECT * FROM media WHERE id = ?');
        $stmt->execute([ $_GET['id'] ]);
        $media = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    if (isset($_GET['id'], $_POST['title'])) {
        
        $full_path = $media['full_path'];
        
        if ($media['full_path'] != $_POST['full_path']) {
            if (!is_dir(dirname('../' . $_POST['full_path']))) {
                mkdir(dirname('../' . $_POST['full_path']), 0777, true);
            }
            if (rename('../' . $media['full_path'], '../' . $_POST['full_path'])) {
                $full_path = $_POST['full_path'];
            }
        }
        
        $stmt = $pdo->prepare('UPDATE media SET title = ?, caption = ?, date_uploaded = ?, full_path = ? WHERE id = ?');
        $stmt->execute([ $_POST['title'], $_POST['caption'], date('Y-m-d H:i:s', strtotime($_POST['date_uploaded'])), $full_path, $_GET['id'] ]);      
    }
    
    if (isset($_GET['id'], $_GET['delete'])) {
        
        unlink('../' . $media['full_path']);
        
        $stmt = $pdo->prepare('DELETE m, pm FROM media m LEFT JOIN products_media pm ON pm.media_id = m.id WHERE m.id = ?');
        $stmt->execute([ $_GET['id'] ]);
    }
    
    $stmt = $pdo->prepare('SELECT *, DATE_FORMAT(date_uploaded, "%Y-%m-%d %H:%i") AS date_uploaded FROM media ORDER BY date_uploaded DESC');
    $stmt->execute();
    $media = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode($media);
}

if (isset($_GET['action']) && $_GET['action'] == 'fileexists' && $_GET['path']) {
    if (!file_exists('../' . $_GET['path']) || !is_file('../' . $_GET['path'])) {
        echo '{"result":"The file does not exist!"}';
    } else {
        echo '{"result":""}';
    }
}
?>