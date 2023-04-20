import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { HomeComponent } from './home/home.component'
import { AddTaskComponent } from './add-task/add-task.component'
import { AboutUsComponent } from './about-us/about-us.component'
import { PhotoViewerComponent } from './photo-viewer/photo-viewer.component'
import { TaskDetailComponent } from './task-detail/task-detail.component'
import { EditTaskComponent } from './edit-task/edit-task.component'
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add', component: AddTaskComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'edit/:id', component: EditTaskComponent },
  { path: 'photo/:src', component: PhotoViewerComponent },
  { path: 'detail/:id', component: TaskDetailComponent },
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
