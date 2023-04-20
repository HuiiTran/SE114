import { Component, OnInit } from "@angular/core";
import { isAndroid, Page } from "@nativescript/core";
import { Location } from '@angular/common'

@Component ({
    selector: "about",
    templateUrl: "./about-us.component.html",
    styleUrls: ['./about-us.component.css'],
})

export class AboutUsComponent {
    member_list : Array<String>

    constructor(private page: Page, private location: Location) {
        if (isAndroid) {
            this.page.actionBarHidden = true;
        }
        this.member_list = ['Lê Hồng Sơn - 21522553', 'Trần Quang Huy - 21522169', 'Nguyễn Nhật Khang - 21522193']
    }

    back_previous_page(){
        this.location.back()
    }
}