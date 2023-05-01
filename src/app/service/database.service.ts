import { Injectable } from '@angular/core';
var Sqlite = require('nativescript-sqlite');

@Injectable()
export class DataBaseService {
    public getdbConnection() {
        return new Sqlite('todolist');
    }

    public closedbConnection() {
        new Sqlite('todolist').then(db => {
            db.close();
        });
    }
}