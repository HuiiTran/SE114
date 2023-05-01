import { Component } from "@angular/core";
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { Dialogs } from '@nativescript/core'
import { TaskService } from "~/app/service/task.service";

@Component ({
    selector: "top-bar",
    templateUrl: "./top-bar.component.html",
    styleUrls: ['./top-bar.component.css'],
})

export class TopBarComponent {
    task;
    id : number;
    image_path: string;
    title: string;

    constructor(public route: ActivatedRoute,
                public router: Router, 
                public location: Location,
                public taskService: TaskService) { }
    
    ngOnInit() {
        const routeParams = this.route.snapshot.paramMap;
        this.id = Number(routeParams.get('id'));
        this.image_path = routeParams.get('src')
        this.task = this.taskService.getTask(this.id);

        if(this.image_path){
            let path_split = this.image_path.split("/")
            this.title = path_split[path_split.length-1]
        }
    }

    back_to_homepage(){
        const confirmOptions = {
            title: 'Bạn có chắc chắn?',
            message: 'Thoát mà không lưu?',
            okButtonText: 'Vâng',
            cancelButtonText: 'Hủy bỏ',
        }
        
        Dialogs.confirm(confirmOptions).then(result => {
            if(result){
                this.location.back()
            }
        })
    }

    back_previous_page(){
        this.location.back()
    }
    
    edit(id){
        this.router.navigate(['/edit', id ]);
    }

    delete(id){
        const confirmOptions = {
            title: 'Bạn có chắc chắn?',
            message: 'Bạn chắc chắn rằng muốn xóa',
            okButtonText: 'Vâng',
            cancelButtonText: 'Hủy bỏ',
        }
        
        Dialogs.confirm(confirmOptions).then(result => {
            if(result){
                this.taskService.deleteTask(id);
                this.location.back();
            }
        })
    }
}