// tslint:disable:no-console
import cookieParser = require('cookie-parser');
import express, { Application } from 'express';
import cors from 'cors';
import { initDb } from './db/Mongo';
import { wachlistApi } from './api/endpoints/Watchlist';
import { ShoppingListHandler as shoppingListApi } from './api/endpoints/ShoppingList';
import { LoginHandler as loginHandler } from './api/endpoints/Login';
import { Config, parseConfig } from './config';
import { notebookHandler } from './api/endpoints/Notebook';
import { calendarEventHandler } from './api/endpoints/CalendarEvents';


function initMiddlewares(config: Config, app: Application) {
    app.use(cors({
        origin(origin, callback) {
            const re = new RegExp(`${config.domain}(\:\d{2,5})?`);

            if (re.exec(origin) === null) {
                return callback(null, false);
            }

            return callback(null, true);
        },
        credentials: true,
    }));

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
}

async function run(): Promise<void> {
    try {
        const config = parseConfig();

        await initDb(config);

        const app = express();
        initMiddlewares(config, app);

        wachlistApi(app, config);
        shoppingListApi(app, config);
        loginHandler(app, config);
        notebookHandler(app, config);
        calendarEventHandler(app, config);


        // const server = https.createServer({
        //     cert: config.cert,
        //     key: config.certKey,
        // }, app);

        app.listen(config.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at ${config.domain}:${config.port}`);
        });
    } catch (e) {
        console.error(`Fatal: ${e}`);
    }

}

run().catch(console.dir)


