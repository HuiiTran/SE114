import { Component } from '@angular/core'
import { DataBaseService } from './service/database.service'
@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
  providers: [DataBaseService],
})
export class AppComponent {
  constructor(private database: DataBaseService) {
    this.database.getdbConnection().then(db => {
        db.execSQL(
            'CREATE TABLE IF NOT EXISTS Category (category_id INTEGER PRIMARY KEY AUTOINCREMENT, category_name TEXT)'
        ).then(
            () => {},
            error => {
                console.log('CREATE TABLE ERROR', error);
            } 
        );
        db.execSQL(
            'CREATE TABLE IF NOT EXISTS Task (task_id INTEGER PRIMARY KEY AUTOINCREMENT, task_name TEXT, task_date TEXT, task_detail TEXT, task_notify INTEGER, task_overdue INTEGER)'
        ).then(
            () => {},
            error => {
                console.log('CREATE TABLE ERROR', error);
            }
        );
        db.execSQL(
          'CREATE TABLE IF NOT EXISTS Task_Photo (task_id INTEGER, taskphoto_id INTEGER, tp_name TEXT , PRIMARY KEY (task_id, taskphoto_id))'
      ).then(
          () => {},
          error => {
              console.log('CREATE TABLE ERROR', error);
          }
      );
    });
}
}
