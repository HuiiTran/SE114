import { Injectable, OnInit } from '@angular/core';
import * as AppSettings from '@nativescript/core/application-settings'
import { LocalNotifications } from '@nativescript/local-notifications';
import { Task } from "./task"
import { DataBaseService } from "./database.service"
import { errorHandler } from '@nativescript/angular';
import { Application } from '@nativescript/core';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasks: Array<any>;
    private db: any;
    // private types: Array<any>;

    public constructor(private database : DataBaseService) { 
        const openFirstTime = AppSettings.getBoolean("FistTime");

        /* check using app first time or not */
        if(openFirstTime == null || openFirstTime == undefined){
            this.tasks = []
            AppSettings.setString("TaskData", JSON.stringify(this.tasks)); // store tasks data
            AppSettings.setBoolean("FistTime", false);
        }
        else {
            this.tasks = JSON.parse(AppSettings.getString("TaskData")); // get task data that store in app settings
            this.tasks.forEach((task) => {task.due_date = new Date(Date.parse(task.due_date))}) // convert from string to Date type
        }

        // const openFirstTime = AppSettings.getBoolean("FistTime");

        // /* check using app first time or not */
        // if(openFirstTime == null || openFirstTime == undefined){
        //     this.tasks = []
        //     AppSettings.setBoolean("FistTime", false);
        // }
        // else {
        //     this.Item();
        //     this.tasks.forEach((task) => {task.due_date = new Date(Date.parse(task.due_date))}) // convert from string to Date type
        // }
    }


    // Item(): Array<any> {
    //     this.tasks = [];
    //     this.database.getdbConnection().then(db => {
    //         db.all('SELECT task_id, task_name, task_detail , task_date, task_notify, task_overdue FROM Task'
    //         ).then(
    //             rows => {
    //                 for (let row in rows) {
    //                     this.tasks.push({
    //                         'id': rows[row][0],
    //                         'name': rows[row][1],
    //                         'detail': rows[row][2],
    //                         'due_date': rows[row][3],
    //                         // 'photo': rows[row][4],
    //                         'notify': rows[row][4],
    //                         'overdue': rows[row][5],
    //                     });
    //                 }
    //             },
    //             error => {
    //                 console.log('SELECT ERROR', error);
    //             }
    //         );
    //     });
    //     return this.tasks;
    // }

    public find(id : number, name : string){
        this.tasks.find(task => task.id == id).name = name
    }

    public setOverdue(id: number, overdue: boolean){
        this.tasks.find(task => task.id == id).overdue = overdue
    }

    public getTasks(): Array<any> {
        return this.tasks;
    }
    
    
    public getTask(id: number){
        return this.tasks.filter(x => x.id == id)[0];
    }

    public addTask(name: string, detail:string, datetime:Date, photoPath:Array<string>, notify:boolean, overdue:boolean){
        let last_id: number;
        
        /* get id */
        this.tasks.length > 0 ? last_id=this.tasks[this.tasks.length-1].id + 1 : last_id=0
        
        this.tasks.push(
            {
              'id': last_id+1,
              'name': name == undefined ? name='':name,
              'detail': detail,
              'due_date': datetime,
              'photo': photoPath,
              'notify': notify,
              'overdue': overdue,
            }
        );
        this.tasks.sort((a, b) => a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) // sort tasks by due date
        this.tasks.map(task => task.id = this.tasks.indexOf(task)) // reorder id
        AppSettings.setString("TaskData", JSON.stringify(this.tasks));

        if(notify){
            this.setNotify(last_id+1, name, datetime)
        }
    }

    // public addTask(name: string, detail:string, datetime:Date, photoPath:Array<string>, notify:boolean, overdue:boolean){
    //     this.database.getdbConnection().then(db => {
    //         db.execSQL("INSERT INTO Task( task_name, task_detail , task_date, task_notify, task_overdue) VALUES(?,?,?,?,?)", [
    //             name,
    //             detail,
    //             datetime,
    //             notify,
    //             overdue,
    //         ])
    //         .then(
    //             id => {
    //                 this.tasks.push({
    //                     'id': id,
    //                     'name': name,
    //                     'detail': detail,
    //                     'due_date': datetime,
    //                     'photo': photoPath,
    //                     'notify': notify,
    //                     'overdue': overdue,
    //                 },);
    //             },
    //             error => {
    //                 alert(
    //                     'An error occurred while adding an item to your list.'
    //                 );
    //             }
    //         );
    //     });
    //     this.tasks.sort((a, b) => a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) // sort tasks by due date
    //     this.tasks.map(task => task.id = this.tasks.indexOf(task)) 
    // }


    public editTask(id:number, name: string, detail:string, datetime:Date, photoPath:Array<string>, notify:boolean, overdue:boolean){
        this.tasks[id] = {
            'id': id,
            'name': name,
            'detail': detail,
            'due_date': datetime,
            'photo': photoPath,
            'notify': notify,
            'overdue': overdue,
        }
        this.tasks.sort((a, b) => a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) // sort tasks by due date
        this.tasks.map(task => task.id = this.tasks.indexOf(task)) // reorder id
        AppSettings.setString("TaskData", JSON.stringify(this.tasks));

        /* set notify */
        let now = new Date()
        if(notify && datetime > now){
            this.setNotify(id, name, datetime)
        }
    }

    public deleteTask(id:number){
        for(let i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].id == id) {
              this.tasks.splice(i, 1);
              this.tasks.sort((a, b) => a.due_date < b.due_date ? -1 : a.due_date > b.due_date ? 1 : 0) // sort tasks by due date
              break;
            }
        }
        this.tasks.map(task => task.id = this.tasks.indexOf(task)) // reorder id
        AppSettings.setString("TaskData", JSON.stringify(this.tasks))
    }

    private setNotify(id:number, name:string, datetime:Date){
        let date_notify = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate()-1,
        datetime.getHours(), datetime.getMinutes())

        LocalNotifications.schedule([
            {
                id: id,
                title: 'Thông báo đến hạn',
                body: "Công việc: " + name,
                badge: 1,
                icon: 'res//logo',
                at: datetime,
                forceShowWhenInForeground: true,
            },
        ])
    }
}