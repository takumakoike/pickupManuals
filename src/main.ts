const ROOT_FOLDER_ID = "";

function getFolderFileLink(){
    if(!ROOT_FOLDER_ID){
        console.log(`ID：${ROOT_FOLDER_ID}のスプレッドシートが見つかりませんでした`)
        return
    }

    // フォルダ情報
    const allFolders = getAllFiles().filter((item) => {
        return item.type === "フォルダ"
    }).map((item) => {
        return [item.name, item.url, item.id]
    });
    const allFiles = getAllFiles().filter((item) => {
        return item.type === "ファイル"
    }).map((item) => {
        return [item.name, item.url, item.id]
    });

}

interface FolderItem {
    name: string;
    type: "フォルダ" | "ファイル" | "";
    url: string;
    id: string;
}
// フォルダ情報を取得
function getAllFiles(): FolderItem[]{
    try{
        const folderId = PropertiesService.getScriptProperties().getProperty("ROOT_FOLDER_ID");
        if(!folderId) return [];
        
        const foldersAndFiles: FolderItem[] = [];
        // フォルダを再帰的に取得する関数を呼び出します
        getFoldersAndFiles(folderId, foldersAndFiles);
        if(foldersAndFiles.length === 0) {
            console.log("フォルダあるいはファイルが見つかりません");
            return [];
        }
        return foldersAndFiles;

    } catch(error){
        console.log(`エラー：${error}`)
        return [];
    }
}

  // フォルダを再帰的に取得する関数
function getFoldersAndFiles(folderId: string, array: FolderItem[]): void {
    // 指定されたフォルダの中身を取得します
    const folder = DriveApp.getFolderById(folderId);
    const contents = folder.getFiles();
    while (contents.hasNext()) {
        const file = contents.next();
        array.push({
            name: file.getName(),
            type: "ファイル",
            url: file.getUrl(),
            id: file.getId()
        });
    }
    const folders = folder.getFolders();
    while (folders.hasNext()) {
        const subFolder = folders.next();
        // フォルダを配列に追加します
        array.push({
            name: subFolder.getName(),
            type: "フォルダ",
            url: subFolder.getUrl(),
            id: subFolder.getId()
        });
        // 再帰的にサブフォルダを取得します
        getFoldersAndFiles(subFolder.getId(), array);
    }
}