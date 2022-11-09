# express-auth-app

### 環境構築
```
## expressのインストール
npm install express-generator -g

## プロジェクト作成
express --view=ejs expresss-auth-app

## パッケージのインストール
npm install mysql2 sequelize uuid dotenv csurf cookie-session bcrypt @sendgrid/mail
```

### 実行方法
```
## クローン
git clone git@github.com:itoigawa/express-auth-app.git

## プロジェクトに移動
cd express-auth-app

## パッケージのインストール
npm install

## サーバーの立ち上げ
npm start
```


※データベースとsendgridのAPIkeyは.envファイルを作成して設定が必要です
