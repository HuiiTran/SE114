import { Component } from "@angular/core";
import { TaskService } from "~/app/service/task.service";
import { DatePipe } from '@angular/common'
import { Location } from '@angular/common'
import * as camera from "@nativescript/camera";
import { ImageAsset } from "@nativescript/core";
import { ImageSource, knownFolders} from '@nativescript/core';
import { mergeMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import * as imagepicker from "@nativescript/imagepicker";
import { Router } from "@angular/router";
import { Dialogs } from '@nativescript/core'

@Component ({
    selector: "search-task",
    templateUrl: "./search-task.component.html",
    styleUrls: ['./search-task.component.css'],
    moduleId: module.id,
})

export class SearchTaskComponent {
    task;
    constructor(public router: Router, 
                public location: Location,
                public taskService: TaskService) { }
    
    ngOnInit() {
    }
    back_previous_page(){
        this.location.back()
    }
}